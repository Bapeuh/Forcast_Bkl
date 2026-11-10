# Forecast V2.2.2 alpha — Modèles de prestations et devis par secteurs

- Prestations & logistique → **Gérer les modèles** : liste partagée, édition, création, duplication et suppression confirmée. Les missions de projets existants ne sont pas modifiées lors de la suppression d’un modèle.
- Paramètre **Secteur commercial** sur les missions, conservé dans les modèles.
- Devis → **Organisation du devis par secteur** : ordre de saisie (historique), regroupement par secteur, ou secteurs + désignations alphabétiques.
- L'ordre du devis est appliqué de manière cohérente au PDF, CSV et XLSX via `core/quotes.mjs`, sans modifier les totaux ni la liste originale.
- Copie des données de démonstration : ne jamais remplacer `data/state.json` d’une installation existante lors de l’application du correctif.

## Installation

Pour une installation existante, arrêter l'application, sauvegarder le dossier `data`, puis extraire le **correctif** dans le dossier de Forecast en conservant son `data/state.json`. Redémarrer et actualiser le navigateur par Ctrl+F5.

La version complète est fournie à part pour les tests isolés.
