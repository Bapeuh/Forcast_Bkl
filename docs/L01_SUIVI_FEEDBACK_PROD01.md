# L01 — Retours de recette et préparation PROD01

État au 10 novembre 2026. Branche de développement uniquement, ne pas fusionner sur main avant tests Windows.

## Développements dans l'archive de préparation (publication du code encore à faire)
- C01–C02 : cases à cocher + glisser-déposer de l'ordre des colonnes, avec boutons ↑ ↓.
- C05 : sous-lignes commerciales proposées depuis les missions de déploiement, sans révéler les coûts chargés et sans double comptage.
- C11 : actualisation des lignes du devis après changement de configuration, en conservant les lignes manuelles et la présentation. Une nouvelle version est créée pour les devis émis.
- Alerte dans la page devis lorsqu'une configuration matérielle change.
- Résultat local : 147 tests réussis (Linux). Tests Windows et recette métier en attente.

## Correctifs restant ouverts
- C03 : style, retour à la ligne et hauteurs des cellules Excel.
- C04/C06–C09 : optimisation pagination A4, avertissement d'impression et lisibilité des sous-lignes.
- C10 : formules Excel actives.

## Backlog Production — source Estimation_MSM_Kev.xlsx
Onglets source : `Résumé`, `Devis 600K`, `Devis Full`, `Matos Template`, `EquipeBackLight`.

L'onglet `EquipeBackLight` contient des noms et des données individuelles de rémunération. **NE PAS le committer dans ce dépôt public**. Modèle de profil pour L04 : poste, coût brut mois/jour, coût chargé mois/jour, tarif ajusté coproduction, tarif ajusté prestation, statut et période de validité. Garder coût et prix de vente distincts. PROD01 : étape → lot → tâche → ressource, J/H, frais, scénarios, marge et devis.

Le classeur et ses données salariales ne sont pas publiés. La branche GitHub ne contient pas encore les fichiers sources de l'archive L01 mise à jour.
