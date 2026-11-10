# Forecast Backlight — V1.7.1 Alpha

## Fonctions ajoutées

1. **Dupliquer une salle** (depuis Lieux & setups et le panneau rapide de l'espace projet) : copie de la salle et de ses setups, sans modification de la source ; nouveaux identifiants ; incrémentation du nom facultative (ex. Salle 1 → Salle 2), ou choix du nom. Les références d'expériences ne sont pas dupliquées.
2. **Répartition des dépenses** : alerte en temps réel lorsque les pourcentages sont inférieurs ou supérieurs à 100 %, avec écart affiché. L'application permet une saisie incomplète mais refuse l'application définitive de parts incorrectes.
3. **Contrats et flux** : export CSV des contrats, export CSV des flux orientés payeur → bénéficiaire, rapport imprimable (option Enregistrer en PDF du navigateur), tableau de soldes par partenaire, graphiques recettes/sorties, schéma des transferts, courbe de trésorerie consolidée mensuelle.

### Limites
- La courbe mensuelle provient de la trésorerie **consolidée** du projet, et non des échéances contractuelles par partenaire. Les contrats restent calculés sur l'ensemble de la période.
- Le rapport de contrats est une **simulation interne indicative**, pas un contrat juridique prêt à signer.
- Les paramètres de calendrier des lieux restent portés par les lieux ; une duplication de salle conserve les éventuels paramètres spécifiques de salle mais ne duplique pas le lieu lui-même.

## Mise à jour

Le correctif contient uniquement les fichiers techniques modifiés ; extraire son contenu dans le dossier V1.7, en conservant les sous-dossiers (`core`, `public`, `tests`) et en remplaçant les fichiers existants.

**Avant toute mise à jour :** arrêter Forecast, sauvegarder `data/state.json` et `data/backups`. Ne pas remplacer `data/state.json` lors de la mise à jour. Rafraîchir ensuite avec Ctrl+F5.

La version complète peut aussi être décompressée dans un autre dossier. Après arrêt du serveur et sauvegarde, recopier uniquement `data/state.json` depuis l'ancienne installation si nécessaire.

## Tests de recette

1. Créer une salle `Salle 1` contenant deux setups avec expériences et billets différents. Dupliquer la salle avec incrémentation. Attendu : `Salle 2`, deux setups copiés, sans changement de la source.
2. Dupliquer la même salle avec un nom personnalisé. Modifier les billets d'un setup copié et vérifier que les billets du setup d'origine ne changent pas.
3. Dans Financier → Finance & contrats, créer deux partenaires. Saisir 40 % / 50 % / 0 % et vérifier l'alerte « 10 % restent à attribuer ». Saisir 60 % / 50 % / 0 % et vérifier le dépassement de 10 %. Saisir 40 % / 60 % / 0 % et appliquer.
4. Créer un contrat revenue share à 30 % de 10 000 € HT de billetterie. Vérifier le transfert de 3 000 € du collecteur vers le bénéficiaire.
5. Exporter les contrats CSV et les flux orientés CSV ; comparer les lignes à l'interface.
6. Imprimer le rapport de contrats au format PDF via le navigateur ; vérifier tableaux, coûts et partenaires.
7. Vérifier la courbe de trésorerie consolidée et son avertissement sur l'absence de mensualisation contractuelle.
8. Fermer Forecast, relancer, vérifier la sauvegarde des salles et contrats, puis ouvrir un projet antérieur.

## Vérifications techniques
- `node --check public/app.js` : OK.
- `npm test` : 65 tests réussis.
- Démarrage HTTP et route du nouveau module `core/rooms.mjs` : OK.
- Test manuel de l'interface à confirmer sous Windows.
