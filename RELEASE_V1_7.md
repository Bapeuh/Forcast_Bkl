# V1.7 Alpha — Contrats & partenaires

## Ajouts
- Navigation hiérarchique : Paramétrage / Financier (menus dépliables).
- Écran Finance & contrats : partenaires, collecteur, conventions à taux, fixe, prix par visiteur, minimum garanti récupérable ou non.
- Assiette de revenue share choisie : billet HT, billet HT après frais, billet TTC.
- Répartition globale indicative des dépenses entre partenaires, avec contrôle de la somme des pourcentages.
- Tableau de résultat par partie et export CSV.
- Conservation des projets et modèles V1.6.1 : les nouveaux champs sont optionnels et n'altèrent pas le calcul initial.

## Limites importantes
- Les contrats de la V1.7 sont des **transferts analytiques entre partenaires**, pas des recettes nouvelles. Le résultat consolidé d'exploitation ne change donc pas lorsqu'on crée un revenue share.
- Le résultat par partenaire est une **simulation globale sur la période**, avec les achats matériels en dépenses. Ce n'est pas une comptabilité de résultat par acteur.
- Pas encore d'échéancier de paiement contractuel ou de réconciliation des avances minimum garanti, ni de TVA contractuelle, ni de comptabilité des transactions bilatérales complexes.
- Le cashflow V1.6 existant **n'intègre pas encore ces transferts contractuels**; l'interface l'indique et il ne faut pas présenter le tableau de cashflow comme un cashflow de chaque partenaire.
- La répartition des dépenses est pour le moment globale, pas poste par poste.

## Recette prioritaire
1. Depuis Financier → Finance & contrats, ajouter Exploitant et Coproducteur.
2. Créer un revenue share 30 % sur billet HT : le montant doit correspondre à 30 % du CA HT billetterie et le solde consolidé rester identique.
3. Tester licence fixe, prix par visiteur, minimum garanti récupérable et non récupérable.
4. Répartir les dépenses à 30 % Backlight et 70 % Exploitant ; vérifier somme = 100 %.
5. Vérifier l'export CSV, puis quitter et relancer : conventions conservées.
6. Comparer un projet ancien V1.6.1 : aucun de ses calculs initiaux ne doit changer.

## Installation
Fermer l'ancienne instance, extraire l'application dans un nouveau dossier, puis lancer `DEMARRER_WINDOWS.bat`. Pour récupérer les projets, sauvegarder puis copier uniquement `data/state.json` de l'ancienne installation. Ne jamais écraser ce fichier avec celui de l'archive.
