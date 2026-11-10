# V2.1 Alpha — Générateur de devis

## Ajouts
- Menu **Financier → Générateur de devis**, et accès depuis **CAPEX & devis**.
- Création d’un devis indépendant fondé sur les postes CAPEX + missions (installations, formation, logistique), sans doubler les missions.
- Personnalisation du client, du devis, du profil émetteur, des lignes et catégories, des prix unitaires, des taux de TVA et des conditions.
- Lignes facultatives, lignes manuelles, regroupement en prestation commerciale unique (les lignes sources sont alors masquées, non supprimées).
- Aperçu client sans coûts fournisseurs, vue interne distincte, versions de devis indépendantes.
- Export CSV français (`;`, virgules décimales, UTF-8 BOM), Excel `.xlsx` éditable et impression navigateur vers PDF.
- Les devis sont sauvegardés dans le projet `data/state.json` avec les autres données.

## Limites de cette alpha
- La version Excel est un tableau professionnel simple, **pas encore une reproduction cellule par cellule du modèle 2021 fourni**. Logo, paginations complexes, mentions légales et formules de feuille restent à affiner.
- Le PDF s’obtient via la fonction Imprimer → Enregistrer en PDF du navigateur.
- Les postes sont importés au moment de la création ; « Actualiser les postes » remplace les lignes après confirmation.
- Les regroupements restent des lignes de présentation, pas des modifications des coûts du forecast.
- Vérifier les coordonnées de l’émetteur, conditions juridiques, TVA et prix avant transmission ; aucun devis n’est envoyé automatiquement.
- Les coûts inconnus restent signalés et bloquent l’impression client.

## Recette
1. Créer un devis depuis Financier → Générateur de devis.
2. Vérifier l’import de matériel et d’une mission de formation / logistique (aucun doublon).
3. Renommer, masquer puis regrouper plusieurs lignes ; vérifier que les totaux suivent.
4. Ajouter une ligne manuelle ; modifier quantité, prix, remise et TVA ; vérifier HT, TVA, TTC.
5. Exporter CSV (ouvrir avec Excel FR), `.xlsx`, PDF. Vérifier les accents et la virgule décimale.
6. Dupliquer en V2, modifier le nouveau devis, revenir en V1 : les versions doivent rester indépendantes.
7. Relancer l’application et vérifier la conservation des devis et des données d’exploitation.
