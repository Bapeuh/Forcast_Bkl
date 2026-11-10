# V1.9.1 Alpha — Dossiers, développement et exploitations

## Nouveautés
- Menu **Dossiers & phases** : dossier global avec plusieurs exploitations.
- **Migration additive** des projets des versions précédentes : chaque exploitation antérieure est associée automatiquement à un dossier portant son nom. Les objets de prévision existants ne sont pas déplacés ni recalculés par la migration.
- **Phase de développement préparatoire** facultative, avec notes. Son budget et ses contrats ne sont pas encore disponibles.
- **Rattacher une exploitation existante** à un autre dossier sans toucher à ses données de calcul.
- **Créer une exploitation vierge** dans un dossier ou **dupliquer une exploitation existante** dans le même dossier.
- Navigation du dossier vers chaque exploitation, qui reste modifiable avec les modules actuels.
- Résumé non financier du dossier (nombre de lieux et expériences).

## Limites importantes
- Cette version utilise intentionnellement les projets d'exploitation existants comme unités de prévision (`state.projects`) ; les dossiers sont des conteneurs (`state.projectGroups`). Cela évite de casser les calculs historiques.
- Une exploitation vierge nécessite la sélection ou la création d'une expérience avant de disposer d'un flux exploitable.
- Les contrats de développement, la bibliothèque liée avec identifiants persistants et les résultats consolidés entre exploitations sont prévus pour V1.9.2 / V1.9.3.
- La duplication reproduit les hypothèses de l'exploitation d'origine : **modifier les dates et tarifs** avant d'en faire une nouvelle proposition.
- Le dossier est sauvegardé localement, aucune collaboration distante.

## Installer sans perdre les projets
1. Fermer l'ancienne version ; copier son dossier `data` ailleurs.
2. Décompresser V1.9.1 dans un **nouveau** dossier.
3. Copier **uniquement** l'ancien `data/state.json` vers V1.9.1 `data/state.json` si vous souhaitez retrouver vos projets.
4. Lancer `DEMARRER_WINDOWS.bat`, ouvrir l'onglet **Dossiers & phases**.
5. Lors du premier chargement, les projets non liés reçoivent chacun un dossier. La sauvegarde automatique stocke la nouvelle structure. Votre copie de l'ancien `state.json` reste votre point de retour.

## Recette prioritaire
1. Ouvrir un ancien projet et vérifier ses résultats (CA / OPEX / CAPEX) avant et après.
2. Ouvrir Dossiers & phases ; confirmer un dossier pour l'ancien projet.
3. Activer « phase développement », ajouter des notes, recharger et vérifier leur persistance.
4. Créer un dossier `Lady Liberty`, y créer une exploitation `Musée d'Orsay`.
5. Créer une seconde exploitation `Shanghai`, affecter une expérience depuis la bibliothèque et confirmer qu'elle reste distincte.
6. Dupliquer `Musée d'Orsay`, modifier son tarif et vérifier que l'original ne change pas.
7. Exporter la sauvegarde JSON et vérifier les sections `projectGroups`, `projects`, `groupId`.

## Tests
79 tests automatiques réussis, dont 5 portant sur les migrations/associations V1.9.1. Démarrage du serveur local et téléchargement du module lifecycle vérifiés. Recette du navigateur à effectuer.
