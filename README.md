# Forecast Backlight Studio — V2.2.4 Alpha

Application locale Windows de simulation de flux et de rentabilité pour expériences immersives, avec catalogue d’expériences, gestion de projets et générateur de devis.

## Démarrage

Prérequis : **Node.js 20 ou plus**. Sous Windows, lancer `DEMARRER_WINDOWS.bat`, puis ouvrir <http://127.0.0.1:4173>.

Tests : `npm test` (**111 tests validés lors de la préparation de V2.2.4**).

## Nouveautés

- Catalogue d’expériences avec variantes et affiches (V2.2.1).
- Bibliothèque de modèles de prestations et regroupement des lignes de devis par secteur (V2.2.2).
- Impression A4 compacte des devis (V2.2.3–2.2.4), avec correction du défaut `key is not defined`.
- Export XLSX via un modèle Backlight historique, stocké sous `assets/devis-backlight-template.xlsx` (V2.2.4).

Consulter `RELEASE_V2_2_4.md` et les notes des versions précédentes pour les fonctionnalités, limites et vérifications recommandées.

## Données et confidentialité

**Ne jamais publier `data/state.json` ni `data/backups/`.** Ils contiennent potentiellement des projets, devis, clients et données commerciales. Le dépôt ne contient que `data/state.example.json` et `data/catalog.json` comme références.

Pour migrer depuis une installation existante, **sauvegarder le dossier `data`**, fermer l’application puis recopier `data/state.json` dans la nouvelle installation. Ne pas remplacer le fichier de production par l’exemple.

## Publication GitHub

Le fichier `PUBLIER_GITHUB_WINDOWS.bat` est prévu pour synchroniser cette version avec `Bapeuh/Forcast_Bkl` depuis Windows avec Git. Il exécute les tests, clone `main` dans un dossier temporaire, copie les sources (hors données privées) puis propose la publication. Consultez le résumé affiché avant confirmation.

> Version alpha : vérifier les tarifs, les calculs contractuels, les mentions légales et le rendu PDF/XLSX avant envoi commercial.
