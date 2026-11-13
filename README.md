# Forecast Backlight Studio — L01 2.3.0 alpha

**Version intégrée à valider**, basée sur L00 V2.2.4 fusionnée dans `main`.

## Windows

1. Décompresser dans un **nouveau dossier**.
2. Lancer `TESTER_L01_WINDOWS.bat`, sélectionner un sous-lot (ou `0` pour les 141 tests).
3. Lancer `DEMARRER_WINDOWS.bat` pour tester dans le navigateur.
4. Suivre `docs/L01_PLAN_DE_RECETTE.md` et noter les anomalies de chaque sous-lot.

Les données de production restent dans `data/state.json` local et sont exclues du package et de Git. Faire une copie de sauvegarde avant de transférer des données réelles à cette nouvelle version.

**GitHub** : publication sur `feature/l01-document-builder` après recette seulement, via `PUBLIER_GITHUB_WINDOWS.bat`.

Voir `RELEASE_L01.md` pour les limites connues.

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


## L01 — Correctifs en cours de recette (novembre 2026)
Voir `docs/L01_RETOURS_RECETTE.md` pour les corrections implémentées et celles en attente, et `docs/PROD01_SOURCE_ET_TARIFS.md` pour le modèle de production non nominatif.
