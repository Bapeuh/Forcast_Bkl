# Forecast Backlight V2.2.4 — Impression et Excel sur le modèle historique

## Corrections
- Correction de `ReferenceError: key is not defined` sur le bouton **PDF · 1 page A4** : la branche d'action doit comparer `part[0]`, et non une variable absente.
- Export Excel via serveur local à partir du **vrai modèle original** `Template devis-facture.xlsx`. Le fichier livré est `assets/devis-backlight-template.xlsx`.
- Conservation du logo Backlight intégré dans le modèle, des styles, bordures, couleurs, fusion de cellules, mentions, coordonnées et des paramètres d'impression.
- Remplissage dynamique du devis à partir des lignes visibles/sélectionnées, ordre des secteurs, client, projet, conditions de règlement et total HT/TVA/TTC.
- Ajout de lignes dans la zone prestations sans écraser les blocs légaux ou financiers. Alignement A4 1 page via mise à l'échelle Excel et zone d'impression recalculée.
- Aucun coût interne n'est publié. Les références commerciales, coordonnés et coordonnées bancaires restent à renseigner/vérifier avant envoi.

## Limites
- Si un devis contient beaucoup de lignes, la taille de police imprimée dans Excel diminue automatiquement pour tenir sur une page. Contrôler l'aperçu avant envoi.
- L'éditeur de blocs PDF et la géométrie fixe du modèle Excel sont deux présentations distinctes.
- Les descriptions détaillées longues restent dans l'éditeur et le PDF ; Excel utilise la désignation courte pour conserver la lisibilité.
- Le logo conservé est celui intégré dans le modèle de 2021. Le logo importé dans Forecast pour le PDF ne remplace pas encore l'image ancrée dans le modèle Excel.

## Installation
1. Arrêter Forecast et fermer sa console.
2. Sauvegarder `data/state.json` et idéalement le dossier `data/` entier.
3. Décompresser le correctif **à la racine** du dossier Forecast existant (les chemins `public`, `core`, `assets`, `server.mjs` doivent être conservés).
4. Remplacer les fichiers existants, sans remplacer `data`.
5. Relancer `DEMARRER_WINDOWS.bat` et actualiser avec Ctrl+F5.

## Validation
- 111 tests automatiques avec succès, incluant le test de non-régression du bouton PDF.
- Test HTTP 200 sur l'API d'export, production d'un XLSX ZIP valide, logo et zone d'impression conservés.
- Vérification visuelle de l'export Excel dans Excel sous Windows reste à faire.
