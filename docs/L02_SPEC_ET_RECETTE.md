# L02 — Vente de licences OZ A/B/C : spécification technique et recette

**Statut : cadrage validable, code métier L02 à développer.** Référence : issue #5 et classeur `BackLight_OZ_Licence_Simulator.xlsx` (feuille « Licence simulator »). Branche `feature/l02-oz-licensing` créée depuis `main` après fusion de L01.

## 1. Objectifs
- Simulateur **autonome** de licence pour une estimation rapide hors projet.
- Simulation **attachée à une exploitation** puis génération d'un accord et d'une proposition/devis.
- Comparateur simultané modèles A/B/C avec **une même capacité** et les mêmes hypothèses de billet et de fréquentation.
- Distinguer **droits contractuels**, **revenus constatés**, **facturation** et **trésorerie**.
- Préserver les contrats et devis validés par snapshots/versionnement.

## 2. Référentiel des paramètres (versionné, non codé en dur)
- Devise de référence du modèle source : USD, configurable.
- Prix plancher HT contractuel : 20.
- Taux A : 20 % ; occupation forfaitaire A : 75 %.
- Taux B : 20 % ; occupation de calcul du MG B : 30 %.
- Taux C : 40 % ; occupation attendue indicative : 50 %.
- 4,3333 semaines/mois **uniquement** pour le mode estimation rapide, pas pour une exploitation datée.
- Engagement de 6 mois : crédit conventionnel à hauteur de 25 % d'un mois de A/du MG B ; 12 mois : 100 % d'un mois. **Ne pas transformer en remise automatique avant clarification contractuelle.**
- Stocker version, source, date d'effet et surcharges propres au contrat pour tout barème.

## 3. Entrées et unités
`ticketHT` (monnaie/visiteur), `sessionsPerHour` (sessions/h/setup), `playersPerSession` (visiteurs/session/setup), `hoursPerDay`, `daysPerWeek`, `setups`, calendrier ou semaines/mois approchées, `expectedFill` (0..1), sessions effectivement jouées (optionnel), `visitorsActual` (optionnel).
- Conserver les distinctions `expectedFill` (remplissage) et `playedSessionsRate` (sessions jouées).
- Une capacité théorique **ne doit pas appliquer** à tort le taux de remplissage prévisionnel.
- Cas d'attraction à sièges dynamiques : 1 setup = 1 siège selon modèle source.
- Politique de sessions/jour : pour le scénario de référence, `floor(sessionsPerHour * hoursPerDay)`; mode calendrier réel doit réutiliser le moteur Flux, avec sa propre politique de départs complets.
- Permettre un prix effectivement pratiqué distinct de la base plancher, sans appliquer le plancher au revenue share réel.

## 4. Formules mensuelles
Soit `K_m` capacité théorique sur le mois, `V_m` visiteurs réels (si fournis) ou projetés, `P` prix billet HT réellement pratiqué et `P_ref = max(P, floorTicketHT)`.
- **A** (forfait) : `dueA_m = rateA * P_ref * K_m * occupancyA`.
- **B** (minimum garanti et RS) : `mgB_m = rateB * P_ref * K_m * occupancyB`; `rsB_m = rateB * P * V_m`; `dueB_m = max(mgB_m, rsB_m)`.
- **C** (RS sans MG) : `dueC_m = rateC * P * V_m`.
- Exposer pour B la part minimale garantie, la part variable et le régime applicable (« MG » / « RS »), sans **additionner** MG + RS.
- Si `P > 0`, point de bascule visiteurs B : `V_threshold = mgB_m/(rateB * P)` (si rateB > 0). Gérer les zéros sans division invalide.
- Pour une estimation rapide, `K_m = floor(sessionsPerHour * hoursPerDay) * playersPerSession * setups * daysPerWeek * weeksPerMonth` selon convention d'arrondi de référence; vérifier contre le classeur.
- Pour calendrier réel, `K_m` provient des journées réellement ouvertes et de la capacité du moteur Flux; pas de 4,3333.
- Calculs financiers en décimal et arrondis explicitement en fin de formule monétaire, avec conservation de l'explication de la base (HT, devise).

## 5. Moteur et architecture proposée
- `core/oz-license.mjs`: fonctions pures de modèle tarifaire, calcul A/B/C, validations, seuils.
- `core/oz-license-capacity.mjs`: adaptateur vers la capacité Flux, estimation rapide ou calendrier daté (éviter deux vérités contradictoires).
- `core/oz-license-contracts.mjs`: snapshots des règles contractuelles et droits.
- `core/oz-license-forecast.mjs`: projection mensuelle, total saison, coût par visiteur, revenu Backlight et coût exploitant.
- Contrôleur UI : menu autonome « Licences OZ » + volet d'exploitation; sélection XP/variante, setup, billet, planning, contrat et scénarios.
- Export : proposer une représentation commune indépendante des rendus L01, pour devis PDF/Excel/CSV.

## 6. Découpage de livraison et tests
**L02.1 — Référentiel et moteur pur.** Barème versionné, contrôle des unités, 3 formules, plancher billet, cas 0 %, contrôle de non-cumul B. Tests unitaires contre cas source.

**L02.2 — Simulateur autonome.** Saisie complète, comparaison mensuelle/annuelle A/B/C, sauvegarde scénarios, réinitialisation et explication des hypothèses. Tests UI et stabilité des valeurs.

**L02.3 — Capacité et calendrier.** Reprise d'un même moteur Flux; distinction « rapide 4,3333 » / « dates réelles ». Tests 1 et plusieurs setups, fermeture et horaires.

**L02.4 — Exploitations et contrats.** Association expérience/variante, devis et contrat, sauvegarde des versions; dates et répartition. Tests de migration d'anciens projets.

**L02.5 — Comparateur économique.** Backlight vs exploitant, coût/visiteur, seuil MG/RS et scénarios d'occupation; prudence si dépenses non renseignées. Tests de cohérence.

**L02.6 — Engagements et crédits.** 6/12 mois, méthode d'imputation explicitement paramétrée et documentée; sinon afficher les crédits comme information contractuelle, hors cash-flow. Tests de non-double comptage.

**L02.7 — Documents et exports.** Production via moteurs L01, libellés A/B/C, champs et clauses d'accord; exports PDF/Excel/CSV cohérents.

**L02.8 — Recette métier.** Cas de référence ci-dessous, tests Windows Node et test comparatif réel avec fichier source, non-régression L00/L01.

## 7. Cas de recette
- Référence : 1 setup, 12 visiteurs/session, 1,3 sessions/h, 8 h/j, 6 j/sem, 4,3333 sem/mois, billet HT 25 USD, taux occupation prévisionnel 50 %. `floor(1.3 * 8)` départs/jour par convention de la source.
- Billet à 15 : A et MG B calculés avec plancher 20 ; RS B et C sur le billet réellement pratiqué.
- B lorsque RS inférieur au MG, égal et supérieur : due = maximum seulement.
- Occupation 0 %, 50 %, 100 %, fermetures, périodes partielles et plusieurs setups.
- Contrat envoyé : modification du planning ou du billet crée une proposition de nouvelle version, sans muter l'ancien montant.
- Affichage clair : contrat USD / projet EUR sans mélange silencieux de devises.
- Aucun coût interne ni référence contractuelle sensible dans un export public non autorisé.

## 8. Décisions à confirmer avant calcul contractuel final
1. Les crédits d'engagement A/B sont-ils remises, avoirs, dépôts ou garanties ? Moment d'application ?
2. Le B est-il calculé sur le CA billet brut HT, ou après frais de billetterie selon convention ?
3. Arrondi et capacité pour les lancements fractionnaires (source : arrondi inférieur quotidien).
4. Devise du contrat et taux de conversion pour projections consolidées.

## 9. Hors scope, à conserver au backlog
- Contrats SAV / maintenance L03.
- Référentiel J/H, équipes et tarifs L04.
- Production détaillée PROD01.
- Schéma financier interactif plus avancé et configurateur client.
