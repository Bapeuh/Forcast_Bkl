# Backlight Forecast V2.1.1 Alpha — Editeur de devis par blocs

## Ajouts
- Vue A4 à deux colonnes avec blocs réordonnables par glisser-déposer ou boutons ↑ ↓.
- Largeur de bloc ajustable : demi-largeur ou toute la largeur.
- Afficher/masquer chaque bloc ; ajout de blocs de texte libre ; espacement compact, normal ou aéré.
- Import de logo PNG/JPG/WebP (limite 500 Ko) conservé avec la version du devis.
- Les mêmes blocs alimentent l’aperçu et le document pour impression / PDF navigateur.
- Description détaillée par ligne commerciale, visible dans la partie imprimable.
- Cinq modèles de conditions de règlement Backlight.
- Compatible avec les anciens devis : mise en page créée à la première ouverture si absente.

## Limites connues
- L’éditeur est une grille souple, pas un placement libre au pixel.
- La mise en page personnalisée s’applique à l’aperçu et au PDF imprimé ; l’export Excel reste tabulaire et **ne reproduit pas encore les positions des blocs**.
- La pagination du tableau de lignes dépend de la fonction d’impression du navigateur, à vérifier sur les devis longs.
- Aucun PDF n’est généré sur le serveur : utiliser « Enregistrer au format PDF » dans le navigateur.
- Les coordonnées légales du modèle historique doivent être validées avant envoi.
- Les images trop volumineuses ne sont pas importées ; éviter les logos sensibles si l’ordinateur est partagé.

## Tests de recette
1. Créer devis puis Mise en page, voir logo en haut à gauche et informations émetteur à droite.
2. Importer un logo, vérifier l’aperçu et l’impression PDF ; actualiser et vérifier sa conservation.
3. Déplacer un bloc et modifier sa largeur ; actualiser et vérifier la persistance.
4. Masquer le bloc bancaire, le retrouver dans l’éditeur et vérifier son absence dans le PDF.
5. Choisir Aéré puis régler un modèle de conditions de paiement ; saisir une prestation avec détails et vérifier la page imprimée.
6. Dupliquer le devis en V2 ; changer sa disposition et s’assurer que V1 est intacte.
7. Comparer les totaux avec l’ancien export Excel ; ils doivent rester identiques.
