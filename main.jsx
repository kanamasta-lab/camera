import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const colors=[['#ff6f68','Corail'],['#ffae52','Pêche'],['#ffe18b','Vanille'],['#b8dc83','Sauge'],['#a8dedb','Menthe'],['#82aaf0','Ciel'],['#b783e8','Lavande'],['#ed78bd','Rose'],['#ffc0c0','Blush'],['#fffdf8','Blanc']];
const presets=[['🕯️','Bougie','#ffc68d'],['☀️','Chaude','#ff9d68'],['🪔','Neutre','#fff2d8'],['🔵','Froide','#a9c7ff'],['🌈','Arc-en-ciel','rainbow']];

function App(){
 const [mode,setMode]=useState('camera');
 const [stream,setStream]=useState(null); const [error,setError]=useState('');
 const [zoom,setZoom]=useState(1); const [flash,setFlash]=useState('auto'); const [grid,setGrid]=useState(true); const [timer,setTimer]=useState(false);
 const [overlay,setOverlay]=useState(null); const [opacity,setOpacity]=useState(.45); const [facing,setFacing]=useState('environment');
 const [light,setLight]=useState('#fff2d8'); const [intensity,setIntensity]=useState(80); const [temp,setTemp]=useState(50); const [torch,setTorch]=useState(false);
 const video=useRef(null); const file=useRef(null); const canvas=useRef(null); const timerRef=useRef(null);
 useEffect(()=>{startCamera(); return ()=>{stream?.getTracks().forEach(t=>t.stop())}},[facing]);
 useEffect(()=>{if(video.current&&stream) video.current.srcObject=stream},[stream]);
 async function startCamera(){try{setError(''); stream?.getTracks().forEach(t=>t.stop()); const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:1920},height:{ideal:1080}},audio:false}); setStream(s); setZoom(1);}catch(e){setError('La caméra n’est pas accessible. Autorise-la dans ton navigateur puis réessaie.')}}
 async function applyZoom(z){setZoom(z); const track=stream?.getVideoTracks?.()[0]; const caps=track?.getCapabilities?.(); if(track&&caps?.zoom){try{await track.applyConstraints({advanced:[{zoom:z}]})}catch{}}}
 async function setFlashMode(v){setFlash(v); const track=stream?.getVideoTracks?.()[0]; if(!track) return; const torchSupported=track.getCapabilities?.().torch; if(torchSupported){try{await track.applyConstraints({advanced:[{torch:v==='on'}]})}catch{}}}
 async function toggleTorch(){const next=!torch; setTorch(next); const track=stream?.getVideoTracks?.()[0]; if(track?.getCapabilities?.().torch){try{await track.applyConstraints({advanced:[{torch:next}]})}catch{}}}
 function takePhoto(){ if(timer){clearTimeout(timerRef.current); timerRef.current=setTimeout(capture,3000); return} capture() }
 function capture(){const v=video.current;if(!v)return;const c=canvas.current;c.width=v.videoWidth||1080;c.height=v.videoHeight||1920;const ctx=c.getContext('2d'); if(facing==='user'){ctx.translate(c.width,0);ctx.scale(-1,1)}ctx.drawImage(v,0,0,c.width,c.height); const a=document.createElement('a');a.href=c.toDataURL('image/jpeg',.92);a.download=`cozy-lens-${Date.now()}.jpg`;a.click()}
 function importOverlay(e){const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>setOverlay(r.result);r.readAsDataURL(f)}}
 function lightStyle(){if(light==='rainbow')return{background:'linear-gradient(120deg,#ff8a8a,#ffd36e,#aee58f,#8edfe0,#91a8ff,#d29bf2,#ff9acb)',opacity:intensity/100}; return{background:light,opacity:intensity/100,filter:`saturate(${.8+temp/200})`}}
 return <div className="app">
  <div className="topbar"><div className="brand"><span>✦</span><div><b>Cozy Lens</b><small>capture the little things ♡</small></div></div><button className="icon" onClick={()=>alert('Cozy Lens · caméra + lumière')}>⚙</button></div>
  {mode==='camera'?<main className="camera-page">
   <section className="viewfinder">
    {error?<div className="camera-error"><b>Oups ♡</b><p>{error}</p><button onClick={startCamera}>Réessayer</button></div>:<video ref={video} autoPlay playsInline muted className={facing==='user'?'mirror':''}/>}<div className="soft-vignette"/>
    {grid&&<div className="grid"><i/><i/><i/><i/></div>}
    {overlay&&<img src={overlay} className="overlay" style={{opacity}}/>}
    <div className="camera-top"><button className="pill" onClick={()=>setFlash(flash==='auto'?'on':flash==='on'?'off':'auto')}>⚡ {flash==='auto'?'Auto':flash==='on'?'On':'Off'}</button><button className="round" onClick={()=>setFacing(facing==='environment'?'user':'environment')}>↻</button></div>
    <div className="side-controls"><button onClick={()=>setGrid(!grid)} className={grid?'active':''}>⊞<small>Grille</small></button><button onClick={()=>setTimer(!timer)} className={timer?'active':''}>◷<small>{timer?'3s':'Timer'}</small></button><button onClick={toggleTorch} className={torch?'active':''}>☼<small>Flash</small></button></div>
    <div className="zoom"><button onClick={()=>applyZoom(.5)} className={zoom===.5?'sel':''}>0.5</button><button onClick={()=>applyZoom(1)} className={zoom===1?'sel':''}>1×</button><button onClick={()=>applyZoom(2)} className={zoom===2?'sel':''}>2</button></div>
    <div className="camera-bottom"><button className="small-action" onClick={()=>file.current.click()}>▧<span>Ajouter photo<br/><em>(Calque)</em></span></button><button className="shutter" onClick={takePhoto}><span/></button><button className="small-action" onClick={()=>setGrid(!grid)}>⌗<span>Grille</span></button></div>
   </section>
   {overlay&&<div className="overlay-editor"><span>Calque · {Math.round(opacity*100)}%</span><input type="range" min="0" max="1" step=".01" value={opacity} onChange={e=>setOpacity(+e.target.value)}/><button onClick={()=>setOverlay(null)}>Retirer</button></div>}
  </main>:<main className="light-page"><div className="light-canvas" style={lightStyle()}><div className="light-note">{light==='rainbow'?'arc-en-ciel ♡':'lumière douce ♡'}</div></div>
   <section className="light-panel"><h1>Lumière <span>♡</span></h1><h3>Mode lumière</h3><div className="mode-row"><button className={!torch?'sel':''} onClick={()=>setTorch(false)}>☼ Désactivé</button><button className={torch?'sel':''} onClick={toggleTorch}>☀ Toujours</button><button onClick={()=>setTorch(true)}>✦ Auto</button></div><h3>Couleur de la lumière</h3><div className="swatches">{colors.map(([c,n])=><button key={n} title={n} style={{background:c}} className={light===c?'picked':''} onClick={()=>setLight(c)}/>)}</div><h3>Intensité <b>{intensity}%</b></h3><input type="range" min="5" max="100" value={intensity} onChange={e=>setIntensity(+e.target.value)}/><h3>Température <b>{Math.round(2500+temp*45)}K</b></h3><input type="range" min="0" max="100" value={temp} onChange={e=>setTemp(+e.target.value)}/><div className="presets">{presets.map(([i,n,c])=><button key={n} onClick={()=>setLight(c)} className={light===c?'picked':''}><span>{i}</span>{n}</button>)}</div><button className="preview" onClick={()=>setIntensity(Math.min(100,intensity+5))}>☼ Aperçu lumière</button>
   </section></main>}
  <nav><button className={mode==='camera'?'active':''} onClick={()=>setMode('camera')}>▣<span>Appareil</span></button><button className={mode==='light'?'active':''} onClick={()=>setMode('light')}>♧<span>Lumière</span></button></nav>
  <input ref={file} type="file" accept="image/*" hidden onChange={importOverlay}/><canvas ref={canvas} hidden/>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
