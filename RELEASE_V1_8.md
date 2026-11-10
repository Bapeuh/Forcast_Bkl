# Forecast Backlight — V1.8 UX Alpha · Lot 1

## Objectif
Premier parcours de préparation **intégré à la vraie application V1.7.1**, sans moteur financier parallèle. L'outil existant reste disponible : ce lot ne supprime aucun des écrans historiques.

## Nouveautés
- Entrée « Parcours guidé » dans la navigation et accès depuis chaque carte de projet.
- Six étapes : projet, expériences, espaces et setups, prévisions, budget, contrats/rapports.
- Formulaire court pour les premières hypothèses, saisies directement dans le projet actif (pas de double source de données).
- Ajout d'expériences à partir de la bibliothèque partagée ; édition des hypothèses centrales.
- Création de la première structure lieu/salle/setup et ajout d'autres salles/setups.
- Accès en un clic aux paramètres détaillés et aux modules financiers existants.
- Récapitulatif contextuel à droite : visiteurs, CA maximal/estimé, résultat d'exploitation.
- Jauge et raccourcis vers les informations manquantes.
- Navigation responsive ; export et sauvegarde V1.7.1 conservés.

## Limites connues
- Le parcours guidé gère les données essentielles du **premier lieu, première salle, premier setup et première expérience**. Les structures complexes restent configurables dans les vues détaillées existantes.
- L'écran parcours affiche les résultats après validation d'un champ (événement `change`), et non à chaque frappe.
- La V1.8 est un **premier lot UX intégré**, pas une refonte complète des écrans financiers, des éditions multi-salles, ni des rapports.
- Les calculs proviennent sans modification de `core/forecast.mjs`, `core/partners.mjs` et des pages financières V1.7.1.

## Installation
1. Conserver l'installation actuelle V1.7.1 et sauvegarder son dossier `data`.
2. Décompresser la V1.8 dans un autre dossier et lancer `DEMARRER_WINDOWS.bat` (Node.js 20+).
3. Si nécessaire, arrêter les deux applications et copier **uniquement** `data/state.json` de l'ancien dossier vers le nouveau.
4. Relancer puis ouvrir `http://127.0.0.1:4173`.
5. Ne jamais lancer deux versions simultanément sur le port 4173.

## Recette rapide
1. Ouvrir un projet existant, puis **Parcours guidé**.
2. Renommer le projet depuis l'étape 1 : le nom doit être le même dans les autres écrans.
3. Importer une expérience de la bibliothèque depuis l'étape 2, puis vérifier son existence dans `Bibliothèque expériences`.
4. À l'étape 3, configurer le lieu, les dates, la salle, les casques et l'espace disponible ; contrôler que la structure apparaît dans l'ancien écran de configuration.
5. À l'étape 4, changer le remplissage et les sessions jouées, puis comparer les chiffres à `Flux & fréquentation`.
6. À l'étape 5, consulter CAPEX et prestations ; revenir au parcours guidé et vérifier les totaux.
7. À l'étape 6, ouvrir les contrats et exports ; recharger la page pour contrôler la persistance.

## Tests
68 tests Node réussis. Contrôle syntaxique de l'application et test HTTP sur la racine, `app.js`, le moteur et `/api/state` effectués. Validation manuelle dans le navigateur Windows toujours nécessaire.
