# Notes de version — V2.0 Alpha / Lot 1

## Portée
Constructeur visuel **Recette → Collecteur → Bénéficiaires**, intégré à la V1.9.1 et connecté au moteur existant de répartition par partenaire.

## Fonctionnalités
- Création de circuits de recettes par source (billetterie HT, HT net après frais, TTC, recettes annexes HT).
- Sélection du collecteur et des entités destinataires ; conservation de la part du collecteur.
- Partage en pourcentage, calcul des montants et alertes pour les répartitions ≠ 100 %.
- Prévention des circuits actifs redondants portant sur la même famille de recettes.
- Ajout d'entités, duplication désactivée par défaut et suppression de circuits.
- Vue de flux orientée et récapitulatif financier existant mis à jour.
- Export CSV des circuits et impression d'un brouillon de base économique.
- Conservation des contrats historiques, affichés en panneau avancé ; un circuit visuel actif suspend leur application au calcul pour empêcher les doublons.

## Limites connues
- Pas encore de liens par glisser-déposer ni d'édition de flèches géométriques ; les cartes constituent l'interface visuelle initiale.
- Les circuits portent sur des familles de recettes : un seul circuit actif par famille (billetterie ou recettes annexes).
- Assiette TTC signalée comme fiscalement délicate ; calcul de cash par partenaire non détaillé.
- Anciennes licences fixes et MG ne peuvent pas encore être combinés aux circuits actifs : leurs données restent mémorisées mais sont suspendues dans le calcul tant qu'un circuit visuel est actif.
- La génération contractuelle est un **brouillon économique imprimable**, pas un texte juridique complet ; approbation juridique nécessaire.
- Les montants restent estimatifs ; les règles TVA, versements périodiques et paiements effectivement réalisés demandent un module complémentaire.

## Tests manuels recommandés
1. Ouvrir **Financier → Accords contractuels**.
2. Cliquer sur **Importer un exemple 50 / 30 / 20** : collecteur Exploitant, partage Exploitant 50 %, Backlight 30 %, Coproducteur 20 %.
3. Pour 100 000 € de billetterie HT, vérifier les montants : 50 000, 30 000, 20 000 € ; le résultat consolidé doit rester constant.
4. Modifier Backlight à 35 % : l'alerte doit indiquer 105 %, et aucun transfert invalide ne doit être enregistré dans la répartition.
5. Réduire l'exploitant à 45 % et confirmer la nouvelle répartition à 100 %.
6. Dupliquer le circuit : il doit être désactivé, pour éviter un deuxième décompte.
7. Tester l'export CSV et l'impression du brouillon.
8. Ajouter une entité et un circuit « Recettes annexes HT ».
9. Actualiser la page ; vérifier la conservation des paramètres et des autres modules.
10. Revenir à un ancien projet sans circuit : ses contrats historiques doivent rester calculés à l'identique.

## Installation
Décompresser dans un **nouveau dossier** et lancer `DEMARRER_WINDOWS.bat` (Node.js ≥20). Fermer l'ancienne version avant de lancer le serveur (port 4173). Sauvegarder les données existantes, puis copier `data/state.json` vers la nouvelle installation quand les applications sont à l'arrêt. **Ne jamais écraser ou publier `state.json` sans sauvegarde.**

## Vérifications automatisées
`npm test` : 86 tests, dont 7 nouveaux tests sur les circuits. `node --check public/app.js` valide la syntaxe ; démarrage HTTP vérifié.
