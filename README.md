# Cozy Lens ♡

Une petite app photo/lumière inspirée de Pinterest, avec une esthétique cocooning.

## Fonctionnalités
- 📸 caméra avant/arrière
- 🔍 zoom 0.5× / 1× / 2× (si le navigateur/appareil expose le contrôle zoom)
- ⚡ flash/torch quand le navigateur le permet
- ⊞ grille, minuteur 3 s
- 🖼️ import d'une photo en **calque transparent** pour décalquer/reproduire dans la vraie vie
- 💡 mode lumière plein écran avec couleurs, intensité et température
- 🌈 preset arc-en-ciel
- 📱 responsive mobile

## Lancer
```bash
npm install
npm run dev
```
Puis ouvre l'adresse affichée par Vite. Pour la caméra, utilise **HTTPS** en production (ou localhost en développement).

## Build GitHub Pages
Le projet est une Vite SPA. Pour GitHub Pages, tu peux ajouter une action de déploiement Vite ou publier le dossier `dist` après `npm run build`.

> Note navigateur : le vrai contrôle du flash/torch et du zoom dépend des capacités de l'appareil et du navigateur. Le mode Lumière utilise l'écran comme source lumineuse et tente aussi d'activer le torch du téléphone lorsque l'API est disponible.
