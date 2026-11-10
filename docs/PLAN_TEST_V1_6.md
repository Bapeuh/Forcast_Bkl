# Recette V1.6 — Financement et trésorerie

## Préparation
1. Sauvegarder le `data/state.json` de la V1.5.1.
2. Installer la V1.6 dans un autre dossier, fermer l'ancien serveur, lancer `DEMARRER_WINDOWS.bat`.
3. Créer un projet de test sans setup actif et ajouter **une ligne matériel manuelle** dans CAPEX & devis : `TEST — équipement`, quantité 1, prix achat HT **12 000 €**. Ce projet isolé évite de mêler les prix manquants de casques au test. Si un autre équipement est présent, vérifier que le KPI « acquisitions matérielles » égale 12 000 € avant de commencer.
4. Ouvrir **Finance & rentabilité**, dérouler les sections « Financement matériel » et « Trésorerie mensuelle ».

## Tests de calcul

| Test | Réglage | Résultat attendu |
|---|---|---|
| F01 | Achat comptant | Décaissement initial 12 000 €, aucune mensualité |
| F02 | Échelonné, apport 2 000 €, 10 mois, 0 % | Décaissement initial 2 000 €, 10 échéances de 1 000 €, intérêts 0 € |
| F03 | Crédit, apport 2 000 €, 12 mois, taux annuel 12 % | Décaissement initial 2 000 €, première mensualité ~888,49 €, premier intérêt 100 €, intérêts cumulés ~661,86 € ; capital restant à terme = 0 |
| F04 | Leasing, montant financé 8 000 €, apport 1 000 €, 2 mois, taux 0 %, option d'achat 500 € | Décaissement initial 5 000 € (4 000 non loués + apport 1 000), 2 loyers de 3 500 €, 500 € de rachat au dernier mois |
| F05 | Montant financé 99 999 € avec CAPEX connu de 12 000 € | Montant plafonné à 12 000 €, alerte affichée |
| F06 | Premier mois décembre 2026, 3 mensualités | Échéances décembre 2026, janvier et février 2027 |

## Tests de trésorerie et ergonomie

| Test | Manipulation | Résultat attendu |
|---|---|---|
| F07 | Projet avec exploitation finissant en décembre 2026, financement sur 12 mois | Mensualités jusqu'en novembre 2027, même après l'exploitation |
| F08 | Ajouter une mission avant ouverture dans Prestations & logistique | Son coût apparaît dans les décaissements, pas en acquisition matériel |
| F09 | Changer le mode de financement et les paramètres ; recharger avec Ctrl+F5 | Mode, apport, durée, taux, trésorerie et échéances conservés |
| F10 | Exporter les 2 fichiers CSV | Les montants mensuels correspondent aux tableaux affichés |
| F11 | Ouvrir un projet sauvegardé en V1.5.1 | Projet accessible ; financement implicite « Achat comptant » ; coûts existants inchangés |
| F12 | Vérifier un projet avec matériel en stock et en location | Le financement ne s'applique qu'à la quantité **achetée**, pas au stock ni à la location |

## Ce qu'il faut remonter
Pour chaque écart, noter le code Fxx, le mode, les paramètres, le montant observé et éventuellement une capture. Signaler aussi toute étape nécessitant trop de clics ou peu claire.

**Attention :** ceci est une trésorerie **HT simplifiée**, sans modélisation des dates réelles de facturation ni de paiement. Elle ne doit pas servir à arrêter une décision financière sans une validation complémentaire.
