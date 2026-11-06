# Forecast Backlight Studio — V1.2 Alpha (correctifs recette)

**Une première application locale fonctionnelle**, destinée aux tests et à l'itération avec le cahier des charges. Elle n'est **pas encore la totalité de la V1 fonctionnelle** décrite lors du cadrage ; voir le tableau de couverture ci-dessous.


## Nouveautés de la V1.2 Alpha

- Les sections « Paramètres détaillés » ouvertes restent ouvertes lorsqu’un champ change.
- Horaires hebdomadaires et exceptions : saisie clavier au format 24 h `HH:MM` (ex. `09:30`). Une entrée invalide est rejetée.
- Recopie des heures de début et de fin d’un jour à un autre ou vers tous les autres jours (sans modifier l’état ouvert/fermé).
- CAPEX : 1 PC serveur par setup **PCVR et Standalone**. Ex. : 3 setups Standalone => 3 PC serveurs.
- Bibliothèque d’expériences partagée entre projets : les expériences des projets existants sont initialement référencées au premier chargement de la V1.2 ; bouton « Enregistrer dans la bibliothèque » pour des ajouts/modifications ultérieurs, puis « Importer depuis bibliothèque » dans un nouveau projet. Une expérience importée est une copie autonome.

### Installation sur une version précédente

1. Fermer l’application.
2. Sauvegarder **tout le dossier `data/`**, notamment `data/state.json`.
3. Appliquer l’archive de correctif par-dessus les fichiers de l’installation (ne pas écraser le dossier `data/`).
4. Relancer et faire `Ctrl + F5` dans le navigateur.
5. Tester les 4 points ci-dessus ; vérifier que les anciens projets sont toujours présents.

## Démarrer sur Windows

1. Installer **Node.js LTS (version 20 ou supérieure)** si nécessaire.
2. Décompresser `Backlight_Forecast_V1_2_alpha.zip` dans un dossier normal, par exemple `C:\Backlight_Forecast`.
3. Double-cliquer sur **`DEMARRER_WINDOWS.bat`**.
4. Ouvrir **http://127.0.0.1:4173** dans Chrome, Edge ou Firefox (le script essaie de l'ouvrir automatiquement).
5. Pour arrêter, fermer la fenêtre de commande ou faire `Ctrl + C`.

Aucune installation de dépendances (`npm install`) ni aucun Docker n'est nécessaire. Les calculs fonctionnent sans connexion Internet. Un ordinateur Windows avec Node.js suffit.

Vous pouvez aussi lancer `npm start` depuis un terminal. Tester avec `TESTER_WINDOWS.bat` ou `npm test`.

## Ce qui fonctionne maintenant

| Fonction | Statut | Limites actuelles |
|---|---|---|
| Application web locale et navigation | **Fonctionnel** | Interface de première itération |
| Plusieurs projets, sauvegarde auto, duplication | **Fonctionnel** | Stockage dans JSON local, pas encore PostgreSQL |
| Bibliothèque d'expériences avec paramètres | **Fonctionnel** | Coproducteurs et équipements complémentaires en notes, pas encore relations structurées |
| Lieux, salles, setups, horaires hebdomadaires, exceptions | **Fonctionnel** | Multi-expériences par setup avec partage de créneaux, sans planification horaire avancée |
| Moteur sessions / fréquentation 65 % × 85 % | **Fonctionnel** | Pas de modèle horaire avancé, plusieurs salles fonctionnent avec héritage des horaires |
| Personnel + pauses + OPEX | **Fonctionnel, estimation** | Pas de moteur RH réglementaire ni de plannings individuels |
| Catalogue importé depuis `Liste matos.xlsx` | **Fonctionnel** | 30 articles de catalogue, 3 configurations sources, 16 liens fournisseurs, prix historiques |
| Dimensionnement PCVR/Standalone, batteries, VBMS, réseau | **Fonctionnel, règles initiales** | Régler et vérifier les compatibilités selon les versions de matériel |
| Prix de vente matériel, marge 30 % et par ligne | **Fonctionnel** | Prix unitaires de vente incomplets si coût fournisseur manquant |
| Simulations OPEX/recettes/seuil de rentabilité | **Fonctionnel, simplifié** | Pas de contrats multipartenaires en cascade ni leasing financier détaillé |
| Scénarios, duplication, comparaison | **Fonctionnel de base** | Sauvegarde snapshot projet, comparaison imprimable, pas encore gestion complète des versions |
| Comparatif réel/prévisionnel | **Fonctionnel en saisie simple** | Import historique CSV avancé non inclus |
| Exports CSV, JSON, impressions PDF via navigateur | **Fonctionnel** | XLSX natif et rapports design avancés non intégrés |
| Sauvegarde auto, quotidienne, manuelle, restauration | **Fonctionnel** | Aucun stockage cloud ni chiffrement local |
| Fournisseurs : mise à jour automatique des prix | **Non implémenté** | URLs conservées, actualisation manuelle |
| Leasing, MG, contrats en cascade, TVA multi-pays | **Non implémenté** | Exigences conservées dans le cahier des charges |
| Multi-utilisateurs / accès distant | **Non implémenté** | Prévu pour une V2 hébergée |

**Attention** : les résultats financiers sont des estimations de travail, non des états comptables ou devis définitifs. Vérifier les paramètres avant de les utiliser dans un dossier externe. Les prix non renseignés apparaissent comme manquants et **ne sont pas interprétés comme 0 €**. Le coût connu du CAPEX est un sous-total tant que certaines références n'ont pas de prix.

## Essais conseillés

1. Ouvrir la démonstration de 12 casques PCVR et vérifier les sessions, visiteurs et recettes.
2. Dans **Flux & fréquentation**, modifier 65 % puis 85 % et observer les résultats.
3. Dans **Lieux & setups**, changer le nombre de casques à 6, vérifier PC clients et AP.
4. Remplacer PCVR par Standalone : le nombre d'AP doit correspondre aux setups, le nombre de PCVR devient nul.
5. Dans **Personnel**, modifier le coût horaire et la durée des pauses.
6. Dans **Catalogue matériel**, compléter une référence avec prix inconnu, puis dans **CAPEX**, consulter le total recalculé.
7. Dans **Projets & scénarios**, enregistrer un scénario, créer une variante, puis comparer.
8. Dans **Rapports & sauvegardes**, exporter les données, faire une sauvegarde, modifier un tarif et restaurer.

## Structure

```text
Backlight_Forecast_V1/
  core/forecast.mjs       moteur de calcul réutilisable (sans UI ni base)
  public/                 interface web locale
  server.mjs              API locale Node.js (sans dépendances externes)
  data/catalog.json       références initiales (import Excel)
  data/state.json         base locale de travail (créée si absente)
  data/backups/           sauvegardes quotidiennes et manuelles
  scripts/                utilitaire d'import du catalogue initial
  tests/                  tests unitaires métiers
  docs/                   fichiers sources et plan de validation
```

## Migration future vers Utilitaire SaaS

La séparation `core` / `public` / `server` évite de lier les calculs à l'interface. Pour l'intégration future, les modules de calcul devront être repris dans le monorepo SaaS ; remplacer la persistance JSON par PostgreSQL et créer des adaptateurs d'API. **L'intégration n'est pas encore réalisée et ne doit pas être considérée comme un simple copier-coller garanti.**

## Nouveau dépôt GitHub

Ce ZIP contient le code source, mais **aucun dépôt distant GitHub n'a été créé ni publié automatiquement**. Pour démarrer un dépôt séparé :

```powershell
git init
git add .
git commit -m "Initial forecast alpha"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/Backlight_Forecast.git
git push -u origin main
```

Le fichier `.gitignore` évite d'envoyer la base locale de travail ou les sauvegardes.

## Test et licence

Commande : `npm test` — 11 tests métiers. En complément, lancer les tests manuels décrits dans `docs/PLAN_DE_TEST.md`.

Outil privé de prototypage Backlight Studio. Ne pas publier des informations commerciales sensibles dans un dépôt public.


## Publication GitHub

Pour publier les sources dans `Bapeuh/Forcast_Bkl`, lancer `PUBLIER_GITHUB_WINDOWS.bat` sur un PC avec Git et les droits de publication GitHub. Le script clone le dépôt et pousse les sources, sans inclure `data/state.json` (données locales). Le projet de démonstration est conservé dans `data/state.example.json`.


## V1.1 — Corrections fonctionnelles de la recette (06/11/2026)

- Info-bulles « ? » ; le délai après fin de partie remplace l’ambiguïté de l’ancien « intervalle ». Anciennes données conservées et interprétées via interval - durée.
- Multi-sélections casques, matériel et coproducteurs avec création de références.
- Setup multi-expériences, répartition automatique de créneaux (somme 100 %) et prix TTC par expérience.
- Date de fin ajustée et ouverte si le début la dépasse ; date d’exception préremplie dans la période ; bouton Valider qui replie les exceptions.
- Fréquentation filtrée par plage de dates et export CSV correspondant ; CA maximal / CA prévisionnel.

### Mise à jour depuis Alpha2
1. Fermer l’application.
2. Copier votre dossier **data** dans un endroit sûr.
3. Remplacer les fichiers de l’application par ceux de V1.1 en **conservant impérativement votre data/state.json**.
4. Redémarrer le serveur et forcer l’actualisation navigateur Ctrl+F5.
5. Les anciennes sessions stockaient l’écart entre deux départs. Le nouvel écran affiche le battement après fin de partie.

La V1.1 reste une alpha de recette, pas une version comptable certifiée.
