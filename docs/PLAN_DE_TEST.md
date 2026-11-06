# Plan de recette — Forecast Backlight V1 alpha

## I. Fonctions à tester dans le navigateur

- [ ] Démarrage sous Windows en double-cliquant sur `DEMARRER_WINDOWS.bat`.
- [ ] Vue d'ensemble : résultats immédiatement visibles sur projet démo.
- [ ] Modification taux de sessions : 65 → 50 %. La fréquentation baisse.
- [ ] Modification remplissage : 85 → 90 %. La fréquentation augmente.
- [ ] Ajout d'une expérience, puis création d'un setup affecté à celle-ci.
- [ ] Changement PCVR → Standalone, mise à jour des PC/AP dans CAPEX.
- [ ] Fermeture exceptionnelle : aucun trafic ce jour-là.
- [ ] Ajustement coût chargé et pauses, recalcul OPEX.
- [ ] Ajout d'un coût variable par visiteur, baisse du résultat.
- [ ] Ajout d'une dépense et d'une recette annexe.
- [ ] Ajout d'une ligne CAPEX avec prix unitaire et marge propre.
- [ ] Modification d'un prix catalogue, puis retour dans CAPEX.
- [ ] Sauvegarde projet, fermeture, réouverture : données conservées.
- [ ] Création de deux scénarios, comparaison imprimable.
- [ ] Export CSV fréquentation et devis ; vérifier les caractères et montants.
- [ ] Export complet JSON et import/restauration.
- [ ] Saisie d'un réalisé et observation des écarts.

## II. Cas de tests numériques connus

- 8h d'ouverture, 35 min d'expérience, lancements toutes les 20 min = 23 sessions potentielles (la dernière doit finir à l'heure de fermeture).
- 10 joueurs/session, 23 sessions, 65 % jouées et 85 % remplies = 127,075 visiteurs théoriques par jour.
- 12 casques PCVR : 12 PC clients + 1 serveur + 4 AP.
- 12 casques HTC : 12 licences VBMS, 24 batteries de spare ; chargement des batteries hors casque seulement.
- 1 setup Standalone : 1 AP.
- Achat 1 000 € HT, marge 30 % sur vente HT : prix de vente 1 428,57 € HT.
- Prix inconnu : affichage « À vérifier » et pas de prix de vente total prétendument complet.

## III. Points métier à valider ensemble avant utilisation externe

1. Recoupement des capacités, intervalles et horaires pour des sessions simultanées.
2. Application des pauses et ETP aux contrats spécifiques.
3. Dimensionnement de réseau et switchs, notamment PoE / zones techniques / KVM en cascade.
4. Les kits Pico et HTC, batteries, chargeurs, licences et matériel déjà inclus.
5. Actualité et provenance des prix d'achat du fichier d'origine.
6. Modalités contractuelles, droits IP, MG, partage des revenus, TVA et leasing.
7. Précision du seuil de rentabilité pour panier moyen multiple et coûts par session.

## IV. Suivi des anomalies

Après avoir testé, noter pour chaque anomalie : écran, manipulation, résultat attendu, résultat constaté et capture d'écran. Nous les corrigerons par séries, puis compléterons les fonctions avancées.
