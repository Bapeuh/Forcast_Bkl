# Correctif V1.6.1 — Taux nominal du crédit et du leasing

## Cause
Le gestionnaire des formulaires traitait tous les champs terminant en `Percent` comme des pourcentages à convertir en fractions, en supprimant le suffixe du nom de propriété. Il enregistrait donc `finance.funding.annualRate = 0.12` au lieu de `finance.funding.annualRatePercent = 12`. Le champ et le moteur de calcul lisaient toujours `annualRatePercent`, qui restait à 0.

## Correction
Le champ `finance.funding.annualRatePercent` est désormais enregistré directement en points de pourcentage (par exemple `12` pour 12 %) ; les autres champs `%` continuent à utiliser leurs conventions existantes.

## Installation
1. Fermer Forecast.
2. Sauvegarder le dossier `data` (notamment `data/state.json`).
3. Copier `public/app.js` depuis cette archive dans le dossier `public` de la version V1.6 en remplaçant l'ancien.
4. Relancer `DEMARRER_WINDOWS.bat`, puis actualiser avec Ctrl+F5.

## Recette
- Mode `Crédit amortissable`, investissement 12 000 €, apport 2 000 €, 12 mensualités, taux nominal 12 %.
- Le taux reste affiché à **12 %** après sortie du champ et rafraîchissement.
- Intérêt de la première échéance : **100 €** ; intérêts totaux > 0 ; capital restant à la fin : 0 €.
- Exporter l'échéancier CSV et contrôler qu'une ligne contient des intérêts > 0.
- Faire aussi un test à **0 %** : pas d'intérêts.
- Le même champ existe en mode Leasing : confirmer que le taux persiste également.

**Note :** les échéanciers CSV envoyés avec le retour utilisateur correspondent à un taux de 0 % (colonne intérêts = 0). Il faudra les réexporter après modification.
