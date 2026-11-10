# Forecast Backlight Studio — V1.8.1 UX

## Corrections

- Suppression des lieux, salles et setups directement depuis le panneau de l'arborescence « Espace projet → Configuration ».
- Suppression également possible sur les éléments du parcours guidé (premier lieu/salle/setup).
- Confirmation avant suppression des éléments imbriqués. La suppression d'un lieu retire ses salles et leurs setups; celle d'une salle retire ses setups. Ces opérations modifient le projet actif et ne sont pas un archivage.
- Suppressions des lieux/salles/setups également confirmées dans « Configuration complète ».
- Suppression d'une expérience bloquée si elle est encore affectée à un setup, afin d'éviter les références brisées. Retirer d'abord les affectations.
- Bouton « Retour au parcours guidé » sur les pages de configuration détaillée, avec conservation de l'étape du parcours.
- Présentation financière réorganisée en trois vues distinctes : **Rentabilité & recettes**, **Plan de financement & trésorerie**, **Accords contractuels & partenaires**. Les moteurs et données existants sont préservés.

## Recette recommandée
1. Ouvrir **Espace projet → Configuration**. Sélectionner une salle et vérifier la présence de « Supprimer cette salle » dans le panneau droit. Annuler une première fois : elle doit rester présente.
2. Dupliquer une salle, puis supprimer seulement la copie. Vérifier que ses setups ne sont plus comptés mais que la salle d'origine reste intacte.
3. Créer puis supprimer un lieu : vérifier la confirmation mentionnant la suppression des salles et setups enfants.
4. Dans **Parcours guidé → Espaces & setups**, vérifier la possibilité de supprimer les premiers éléments. Vérifier que les changements de capacités et recettes suivent les suppressions.
5. Depuis **Personnel**, **CAPEX** et **Accords contractuels**, cliquer sur « Retour au parcours guidé ». La dernière étape utilisée doit être restaurée.
6. Dans le menu **Financier**, ouvrir séparément Rentabilité, Plan de financement, Accords contractuels. Vérifier que paramètres de financement et contrats ont été conservés.
7. Vérifier la sauvegarde après rechargement. Essayer une copie d'un projet V1.8 existant.

## Précautions

- Tester dans un nouveau dossier. Arrêter l'ancienne version (même port 4173).
- Sauvegarder votre dossier `data` original, puis copier seulement `data/state.json` dans `data` de cette version, application arrêtée.
- Ne jamais copier un `state.example.json` par-dessus vos données.
- Les suppressions sont confirmées mais **ne sont pas annulables en un clic**. Pour revenir en arrière, utiliser une sauvegarde antérieure.
- Les tests automatiques ne remplacent pas une recette navigateur. Le module contractuel conserve les limites fonctionnelles déjà identifiées (échéances contractuelles par partenaire à développer).
