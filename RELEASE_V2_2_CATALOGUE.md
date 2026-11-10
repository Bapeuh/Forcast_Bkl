# Catalogue OZ — 11 configurations

Import automatique dans la bibliothèque commune au premier démarrage. Les données existantes sont préservées et l’ajout est idempotent.

Source : `BackLight_OZ_Licence_Simulator.xlsx`, feuille `Licence simulator`, lignes 16 à 26.

**Important** : le fichier source indique la cadence (sessions par heure), pas la durée réelle de jeu. Pour permettre l’ouverture dans le moteur actuel, `duration` est une **estimation provisoire de l’espacement des départs** (60/cadence) ; `sessionDurationEstimated: true` identifie ce champ comme à confirmer. La durée réelle doit être renseignée avant un forecast commercial. Les modes PCVR/Standalone, les prix de billet, les ratios de personnel et les dimensions absentes sont également à confirmer. L’expérience La Magie Opéra 8×8 m, Toyland 8×8 et 10×10 m, Ascenders et Eclipse à deux espaces sont importés selon les variantes du fichier.

La bibliothèque est partagée par les projets. Une référence importée dans un projet devient une copie indépendante. Les sauvegardes de l’ancienne version doivent être conservées.
