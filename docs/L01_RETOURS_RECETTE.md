# L01 — Corrections de recette consolidées

Statut : **travail sur branche de développement / archive, non validé en production**.

| ID | Retour | Développement | Reste à vérifier |
|---|---|---|---|
| C01 | Cases à cocher pour colonnes devis | Implémenté en RC feedback | Interface Windows |
| C02 | Glisser-déposer ordre des colonnes | Implémenté + boutons ↑ ↓ | Interface Windows / PDF |
| C03 | Alignement/hauteur des sous-lignes Excel | Non traité | Amélioration XLSX et recette |
| C04 | Une seule page A4 si lisible | Hérité du L01 | Recette visuelle |
| C05 | Liaison mission -> sous-lignes commerciales | Première implémentation | Tarifs, J/H et rentabilité |
| C06 | Avertissement de pagination dans PDF | Non traité | Ne pas inclure dans export |
| C07 | Espacements impression | Non traité | Recette PDF A4 |
| C08 | Lisibilité sous-lignes | Partiellement repris | Recette PDF/Excel |
| C09 | Taille minimale impression | Hérité | Recette métier |
| C10 | Formules Excel actives | Non traité | Conception XLSX |
| C11 | Casque -> CAPEX -> devis actualisable | Amélioré : synchronisation préservant lignes manuelles | Vérifier alertes, casques et statut devis |

L01.1/L01.2/L01.6/L01.8 validés par l'utilisateur ; L01.3/L01.4/L01.5/L01.7/L01.9 à corriger ou valider avec réserves ; L01.10 en cours.

**Règle** : les sous-lignes générées sont des postes de prix de vente, alloués au forfait, et non des coûts chargés divulgués au client. Le montant du parent reste la seule recette comptabilisée.
