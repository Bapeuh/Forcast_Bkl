# Forecast Backlight — L01 intégral, recette séquentielle

**Candidat à la recette : 2.3.0-alpha.1 · 10 novembre 2026**

Le package contient **tous les changements L01.1 → L01.10**, intégrés dans une seule application. **On les valide séparément** en suivant l'ordre ci-dessous. La suite automatique est un garde-fou, pas une validation visuelle du PDF.

## Avant chaque sous-lot

1. Fermer l'application précédente, extraire le ZIP L01 dans un **nouveau dossier** (ne pas écraser L00).
2. Copier au besoin une copie de votre `data/state.json` local dans le nouveau dossier. **Ne jamais publier ce fichier sur GitHub**. Sans copie, l'application crée un état de démonstration.
3. Lancer `TESTER_L01_WINDOWS.bat` et choisir le sous-lot, puis exécuter la validation métier dans l'application `DEMARRER_WINDOWS.bat`.
4. Si le sous-lot est validé, noter « OK » dans le tableau de recette. Si une anomalie apparaît, copier l'erreur et indiquer le sous-lot et les actions exactes.

## Recette à dérouler dans l'ordre

| Sous-lot | Test métier à effectuer | Résultat attendu | État initial |
| --- | --- | --- | --- |
| **L01.1** Modèle documentaire et migration | Ouvrir un devis V2.2.4 existant et créer un nouveau devis | L'ancien reste lisible (grille 2 colonnes historique) ; le nouveau utilise six colonnes ; les totaux restent inchangés | À tester Windows |
| **L01.2** Éditeur six colonnes | Onglet Devis → Mise en page ; choisir largeur 1/6 puis 6/6, réordonner un bloc, changer hauteur/marges/alignement | Mise en page adaptée, sauvegardée et retrouvée après redémarrage | À tester Windows |
| **L01.3** Tableau personnalisable | Basculer tableau complet, simplifié, sans PU et prix avant quantité | Visibilité et ordre des colonnes changent ; total du devis inchangé | À tester Windows |
| **L01.4** Sous-lignes commerciales | Créer Installation 5 000 € puis J/H : 5×600 ; repas : 5×50 ; déplacement : 2×875 ; basculer synthétique/détaillé/personnalisé | Le parent vaut 5 000 €, jamais 10 000 € ; prix cachés si détail chiffré incomplet/incohérent | À tester Windows |
| **L01.5** Pagination A4 | Ouvrir un devis avec 19 lignes puis 35 lignes. Tester auto, compact et une page | Aucun texte tronqué ; titres et sous-lignes lisibles ; en mode très chargé l'impression multipage reste possible | À tester Windows |
| **L01.6** Impression PDF | `PDF · 1 page A4`, puis `PDF · multipage`, « Enregistrer au format PDF » | Rendu sans erreur JS, logo et totaux présents ; avertissement si la page unique ne peut être tenue lisiblement | À tester Windows |
| **L01.7** Excel | Exporter Excel et ouvrir dans Microsoft Excel ; vérifier 19 lignes, totaux, sous-lignes et impression A4 | Montants identiques au PDF et sous-lignes bien présentes dans le classeur | À tester Windows |
| **L01.8** Bibliothèque de modèles | Enregistrer un modèle de blocs, l’appliquer sur un autre devis, exporter puis importer JSON | Modèle persistant, sans modifier automatiquement un devis existant ; copie indépendante | À tester Windows |
| **L01.9** Recette Renault | Reconstituer 19 lignes du devis DEV-2026-001 et comparer A4 + XLSX | Même montant et mêmes rubriques ; aucune coupure ou duplication ; inspecter au moins un PDF exporté | À tester Windows |
| **L01.10** Casques, matériel et synchronisation | Sélectionner HTC/PICO dans le setup, changer dimensions et signaler 4 casques déjà installés sur 12. Créer devis, changer casques/stock, cliquer Actualiser. Répéter avec devis Envoyé | XP incompatibles signalées ; 8 casques à acheter si aucun autre stock ; diff avant synchronisation ; devis envoyé **copié en nouvelle version**, jamais écrasé | À tester Windows |

> Le même code est présent dès le début ; on ne publie pas des versions intermédiaires entre chaque étape de recette. Le menu Windows cible les tests automatiques du sous-lot choisi, tandis que ce tableau décrit sa recette métier manuelle.

## Fonctions intégrées

- Modèle documentaire compatible avec les anciens devis, et nouvelle disposition à six colonnes.
- Édition des largeurs de 1 à 6 unités, ordre de blocs, marges internes, hauteur minimale et alignement.
- Tableaux à quatre présentations, sous-lignes en affichage synthétique / détaillé / personnalisé.
- Calcul des sous-lignes avec une seule ligne par prestation dans la somme du devis.
- Blocage des modifications de lignes d'un devis envoyé ou accepté (dupliquer pour modifier).
- Sauvegarde/import/export de modèles de documents dans l'état de l'application.
- Excel historique avec lignes détaillées, champs de l'ancienne identité Backlight à confirmer.
- Choix du casque à l'échelle du setup ; filtres mode, taille et casque ; nombre déjà installé.
- Suivi matériel : acheté / stock / location / déjà installé ; split des lignes commerciales par origine de coût.
- Synchronisation sur confirmation, et création d'une nouvelle version si le devis n'est plus brouillon.

## Limitations connues / points à valider

- **Le PDF est obtenu par impression navigateur** (« Enregistrer au format PDF »). Aucun générateur PDF serveur autonome n'est inclus dans ce candidat.
- Le moteur de pagination reste fondé sur **CSS print + ajustement prudent** ; la qualité de l'A4 et les pages longues doivent être validées visuellement avec le devis Renault. Une pagination page-par-page entièrement pilotée par des mesures de rendu est un approfondissement possible après recette.
- Le modèle XLSX historique conserve une structure Excel distincte de la grille PDF à six colonnes : les données et montants sont communs, mais pas les positions pixel à pixel.
- Les montants J/H et les sous-lignes commerciales sont saisis dans le devis ; le calcul complet des profils de personnel est prévu au lot **L04**.
- La quantité de casques **déjà installés** est saisie par setup ; le stock et la location des autres équipements restent ajustables dans CAPEX. Le calcul automatique des heures de montage pour tous les équipements est prévu ultérieurement.
- Compatibilité XP : une compatibilité **non renseignée** est présentée « à vérifier », jamais considérée comme certifiée.
- Les tests automatisés ne remplacent pas la recette visuelle Windows.

## Bilan des tests automatisés dans l'environnement de préparation

- L00 initial : 120 tests.
- L01 : 21 nouveaux tests.
- **Total : 141 tests réussis, 0 échec** (Node dans l'environnement Linux de préparation).
- Les tests HTTP incluent le chargement des nouveaux modules et l'export du classeur.

## Publication GitHub

Branche réservée : `feature/l01-document-builder`, créée depuis `main` après la fusion de L00. **Le code L01 n'est pas encore publié** tant que la recette n'est pas approuvée.

Après les tests utilisateur, lancer `PUBLIER_GITHUB_WINDOWS.bat` ; cela publie uniquement le code et les données d'exemple vers la branche L01. Ne pas fusionner dans `main` avant validation des contrôles GitHub Actions et du devis PDF/Excel.
