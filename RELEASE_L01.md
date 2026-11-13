# Release candidate L01 — 2.3.0-alpha.1

**Branche cible :** `feature/l01-document-builder` (ne jamais pousser directement sur `main`).

**Contenu livré :** code intégré des sous-lots L01.1 à L01.10, 141 tests Node réussis dans l'environnement de préparation, application Windows locale sans nouveaux modules npm.

**À vérifier manuellement :** PDF navigateur (A4, 19 lignes Renault et multi-pages), formatage Excel dans Microsoft Excel, ergonomie de l'éditeur à six colonnes, conservation d'une copie de `state.json` réel et migration des anciens devis.

**Protection des données :** ni `data/state.json` ni `data/backups/` dans l'archive source. Le script de publication ne copie que les fichiers de données d'exemple et contrôle la liste `git add`.
