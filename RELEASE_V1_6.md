# Forecast Backlight — V1.6 Alpha · Financement et trésorerie

## Ajouts
- Modes d'acquisition : comptant, paiement échelonné sans intérêts, crédit amortissable, leasing simplifié.
- Paramètres : montant financé (plafonné aux achats matériel connus), apport, mensualités, taux annuel, option de rachat, mois de départ, entité payeuse et trésorerie initiale.
- Échéancier par mois : mensualité, capital, intérêts, option de rachat, solde.
- Tableau de trésorerie mensuel : encaissements HT, dépenses d'exploitation, missions, achats initiaux, remboursement, solde courant, solde cumulé.
- Export CSV des échéanciers et trésoreries.
- Compatibilité avec les projets V1.5.1 : `finance.funding` reste facultatif, ancien projet = achat comptant par défaut.

## Portée et limites
Cette alpha calcule un **cash-flow simplifié HT**, pas une comptabilité : TVA de trésorerie, décalages entre ventes et encaissements, bilan, amortissements, fiscalité, cofinancements réels et contrats commerciaux ne sont pas implémentés. En leasing, le lot n'est pas acquis immédiatement, seuls apport, loyers et rachat éventuel sont décaissés ; l'amortissement utilisé pour l'échéancier est indicatif et n'est pas une qualification comptable du contrat. La première mensualité est placée au mois de départ sélectionné. Les mensualités qui se prolongent après l'exploitation restent visibles.

Le résultat d'exploitation existant est **inchangé** : ne pas confondre profit opérationnel, résultat comptable, rentabilité après investissement et trésorerie. Le calcul du seuil de fréquentation reste opérationnel, sans intégrer le service de la dette.

Les acquisitions dont le prix catalogue est inconnu ne peuvent pas être financées correctement ; compléter les coûts avant de s'appuyer sur les résultats financiers.

## Validation
`npm test` : **50 tests réussis** (dont 8 nouveaux tests de financement). Contrôle syntaxique JavaScript et test HTTP local. L'interface nécessite une recette dans le navigateur.

## Sécurité des données
Tester dans un nouveau dossier et copier `data/state.json` uniquement après sauvegarde. Ne pas remplacer le dossier `data` avec les données de démonstration et ne pas publier les sauvegardes sur GitHub.
