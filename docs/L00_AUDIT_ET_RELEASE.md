# L00 — Audit technique Forecast (9 novembre 2026)

## État réel vérifié
La branche `main` est en V1.2 alpha, commit `a88a45f398188a4b4c51b6c3c9793b59773def63`. La V2.2.4 existe dans l'archive locale `Forecast_V2_2_4_GitHub_pret.zip`, mais le code complet de cette version n'est pas encore présent sur GitHub.

## Sources et résultat des tests dans l'archive L00
- 111 tests V2.2.4 initiaux réussis.
- 9 nouveaux tests ajoutés : état local et sauvegardes, refus de fichier corrompu, restauration, contrôles HTTP, chargement des modules et export XLSX.
- Total obtenu dans l'environnement de préparation : **120 tests réussis**.
- Amélioration locale de `state.json` : sauvegarde de l'ancienne version avant remplacement, écriture atomique, refus d'écraser un état corrompu.
- La source L00 complète et les scripts Windows sont distribués dans une archive distincte. **Les modifications du moteur ne seront effectives sur GitHub qu'après publication de cette archive sur la branche d'intégration.**

## Contrôles de release
1. Tests Node 20/22 sous GitHub Actions.
2. Démarrage Windows et navigation manuelle.
3. Sauvegarde, mise à jour, restauration et redémarrage.
4. Génération du devis Renault PDF/Excel et inspection visuelle.
5. Vérification que `data/state.json`, `data/backups/` et secrets ne sont pas versionnés.
6. Fusion sur `main` seulement après intégration du code complet et recette.

## Restant hors L00
- Editeur PDF à 6 colonnes : L01.
- Tests de rendu visuel navigateur et Excel Windows non effectués.
- Migration de tous les anciens formats historiques : couverture partielle ; continuer à documenter les versions.
