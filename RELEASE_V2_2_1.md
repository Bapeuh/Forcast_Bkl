# Forecast V2.2.1 alpha — Bibliothèque multi-variantes

- Nouveau catalogue visuel avec une fiche par expérience et une affiche locale (PNG/JPG/WebP, max 500 Ko).
- Variantes regroupées dans chaque fiche, modification des paramètres techniques et commerciaux ; ajout, duplication, import dans le projet.
- Migration non destructive depuis `experienceLibrary` : les identifiants des formats historiques sont conservés et les projets restent des copies indépendantes.
- Correction ciblée de l’association Birdy Kingland → Far Reach dans les données projets.
- **Conservation du fichier utilisateur** : `data/state.json` fourni est inclus dans cette archive. Sauvegarder les données avant remplacement. Les affiches sont stockées dans l’état JSON et incluses dans ses sauvegardes.
- Limitations : la sélection de variantes compatibles avec un setup n'est pas encore automatisée depuis la fiche; les paramètres de casque multiples restent gérés dans l'éditeur de projet.
- Test manuel requis : galerie, import et impression, migration depuis l’installation précédente.
