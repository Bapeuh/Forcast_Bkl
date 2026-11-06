# Backlight Forecast — V1.2 Alpha

Application locale de simulation de fréquentation, de configuration VR, de prévisions économiques et de dimensionnement matériel pour Backlight Studio.

## Statut au 6 novembre 2026

La **V1.2 Alpha a été validée en recette utilisateur** pour les fonctions testées. Les tests automatiques de la distribution réussissent (21/21).

**Attention :** le dépôt GitHub n'a pas encore reçu tous les fichiers sources. Les instructions de démarrage ci-dessous ne fonctionneront **qu'après la publication des sources** à partir de l'archive V1.2 Alpha.

## Publier les sources de la V1.2

1. Récupérer l'archive `Backlight_Forecast_V1_2_GitHub_pret.zip` fournie dans la conversation.
2. Décompresser sur Windows.
3. Dans `Backlight_Forecast_V1_2`, lancer `PUBLIER_GITHUB_WINDOWS.bat`.
4. Le script lance les tests, clone ce dépôt, copie les sources **sans `data/state.json` ni sauvegardes privées**, crée un commit et pousse sur `main`.
5. Vérifier que les dossiers `public/`, `core/` et le fichier `server.mjs` sont visibles sur GitHub.

Prérequis : Git pour Windows, Node.js >= 20 et autorisation GitHub de pousser sur `Bapeuh/Forcast_Bkl`. Le script n'utilise pas de `push --force`.

## Démarrage local (après publication)

- Cloner le dépôt sur Windows.
- Lancer `DEMARRER_WINDOWS.bat`.
- Ouvrir http://127.0.0.1:4173
- Tests : `npm test`.

Le stockage local est dans `data/state.json`, ignoré par Git. **Ne jamais publier ce fichier ni les sauvegardes réelles.**

## Principales règles

- Prévisions : remplissage 85 % et sessions jouées 65 % par défaut.
- PCVR : un PC client par casque, un serveur par setup, un AP pour trois casques.
- Standalone : un serveur et un AP par setup.
- Batteries : une installée, deux de rechange par casque.
- Un permis VBMS par casque HTC compatible.
- Marge commerciale : 30 % du prix de vente HT par défaut.
- Bibliothèque d'expériences partagée entre projets et setups multi-expériences.

## Évolutions

- [Recette V1.1](https://github.com/Bapeuh/Forcast_Bkl/issues/1)
- [V1.3 — configurateur matériel avancé](https://github.com/Bapeuh/Forcast_Bkl/issues/2)

Le dépôt reste séparé d'`Utilitaire_SaaS` ; ses moteurs devront rester portables.
