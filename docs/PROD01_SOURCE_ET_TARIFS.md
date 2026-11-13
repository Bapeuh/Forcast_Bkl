# PROD01 — Modèle de devis de production et référentiel de tarifs

**Source de travail locale (non publiée) :** `Estimation_MSM_Kev.xlsx`, fournie par Backlight, novembre 2026.

## Feuilles identifiées
- `Résumé` : synthèse de production.
- `Devis 600K` et `Devis Full` : scénarios de devis de production.
- `Matos Template` : matrice matériel.
- `EquipeBackLight` : référentiel nominal des collaborateurs et des tarifs.

## Mappage cible vers Forecast
- `Projet → Production → Étape → Lot → Tâche → Ressource`.
- Une tâche peut porter des heures, des jours-homme, des sous-traitances ou des frais forfaitaires.
- Chaque tâche possède un **coût prévisionnel** et un **prix de vente**, calculés séparément.
- Plusieurs scénarios doivent pouvoir coexister sans écraser les devis émis.
- Le devis commercial repose sur les mêmes lignes principales et sous-lignes que le générateur L01.

## Schéma de référence des profils (L04)
Champs de l'onglet `EquipeBackLight` : `Nom`, `Prénom`, `Prénom + Nom`, `Poste`, `Statut`, `Coût brut 21J` (forfait, mois, jour), `Coût charges 21J` (forfait, mois, jour), `Taux ajusté Co-prod`, `Taux ajusté Presta`, `Devis entr.`.

Recommandations :
1. Stocker une **grille de tarifs par profil** distincte des personnes ; une personne peut se rattacher à un profil et une période de validité.
2. Conserver les coûts chargés, tarifs de coproduction et tarifs de prestations comme trois valeurs distinctes : ne jamais traiter un tarif de prestation comme un coût réel.
3. Permettre les dérogations par projet et les tarifs historiques figés dans les propositions envoyées.
4. Tarifer les déploiements à partir de profils, en J/H ou en heures, et transmettre au document **uniquement** le prix commercial.
5. Marquer `source`, `date de validité`, `unité`, `statut de vérification` pour chaque montant ; contrôler les formules Excel avant migration.

## Confidentialité impérative
L'onglet `EquipeBackLight` contient **des noms et des informations individuelles de rémunération**. Ne jamais committer le classeur source, un export JSON nominatif, les valeurs salariales, ou des sauvegardes contenant celles-ci dans le dépôt public GitHub.

Le présent document est une **spécification de mapping sans noms ni valeurs individuelles**. L'import des valeurs réelles doit être une opération explicite, locale et protégée, à réaliser au lot L04/PROD01.

## Périmètre
- L01 : lignes commerciales hiérarchiques réutilisables ; aucune importation de rémunération.
- L04 : bibliothèque de profils tarifaires et journées-homme.
- PROD01 (backlog différé) : moteur de production, scénarios, marges, planning et devis de production.
