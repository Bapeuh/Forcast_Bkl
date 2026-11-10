# L00 — Consolidation technique (9 novembre 2026)

## Source et écarts
- GitHub `main` vérifié : V1.2 alpha, commit `a88a45f398188a4b4c51b6c3c9793b59773def63` (6 novembre 2026).
- Source d'intégration : `Forecast_V2_2_4_GitHub_pret.zip` fournie dans la conversation.
- Ne jamais confondre les versions annoncées en archives et la branche `main` réellement publiée.
- Les fichiers `data/state.json`, `data/backups/`, `.env` et les archives d'exploitation ne doivent pas être versionnés.

## Modifications L00
- Conservation de la V2.2.4 et de ses 111 tests unitaires existants.
- Sécurisation de l'état : validation à l'ouverture, refus d'écraser un état corrompu, sauvegarde de la version précédente avant mise à jour/import/restauration, écritures temporaires atomiques.
- Tests supplémentaires : sauvegarde, restauration, rejet état invalide, verrouillage chemin de backup, HTTP réel, chargement des modules, export Excel XLSX.
- CI GitHub Actions Node 20/22 et vérification de l'absence de données de production suivies.

## Recette
1. `npm test` ; tous les tests doivent réussir.
2. `node --check server.mjs` et `node --check public/app.js`.
3. Démarrer `DEMARRER_WINDOWS.bat`, ouvrir un projet de test.
4. Sauvegarder, modifier, restaurer, redémarrer ; les anciennes données doivent être retrouvées.
5. Générer le devis DEV-2026-001 en PDF et Excel ; comparer visuellement avec le modèle fourni.
6. Contrôler le dépôt avant push (`git status`, `git diff --cached --name-only`), vérifier aucun `data/state.json`.

## Limitations / jalons suivants
- Les 120 tests automatisés ne constituent pas une recette navigateur interactive Windows ; PDF multi-pages et qualité visuelle restent à valider dans L01.
- Les migrations entre anciens schémas de projets sont conservées telles quelles. Un moteur de migration versionné et des tests couvrant toutes les archives restent à compléter.
- La synchronisation des sources sur la branche GitHub d'intégration doit être confirmée avant toute fusion sur `main`.
