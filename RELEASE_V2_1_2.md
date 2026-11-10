# Forecast V2.1.2 — Correctif écran vide

## Cause identifiée
Le fichier `public/app.js` importe `/core/quote-layout.mjs`, mais le serveur V2.1.1 ne publiait pas ce module. Le navigateur obtenait HTTP 404 pour cet import ES, ce qui interrompait le démarrage de l'interface. La structure HTML restait visible, mais la navigation et le contenu étaient vides.

## Correction
Le serveur expose explicitement `/core/quote-layout.mjs`. Aucun changement au modèle de données ni au moteur financier.

## Installation du correctif
1. Fermer complètement la fenêtre du serveur Forecast (ou `Ctrl+C`).
2. Sauvegarder le dossier `data` de l'installation.
3. Copier le fichier `server.mjs` du dossier correctif à la racine du dossier Forecast V2.1.1, en remplaçant le précédent.
4. Relancer `DEMARRER_WINDOWS.bat`, puis effectuer un rafraîchissement forcé (`Ctrl+F5`).
5. Vérifier que le menu de gauche et la page d'accueil réapparaissent.

Ne pas remplacer `data/state.json` ni importer un état vierge.

## Contrôles
- `node --check server.mjs`
- `npm test` : 96 tests réussis.
- `GET /core/quote-layout.mjs` : HTTP 200, `Content-Type: text/javascript`.

Les interactions du navigateur doivent encore être validées sur l'installation utilisateur.
