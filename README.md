# Backlight Forecast — V1 Alpha

Application locale de simulation de fréquentation, de configuration VR et de prévisions économiques pour Backlight Studio.

## Statut
**Alpha en cours de recette**. Le périmètre complet du cahier des charges n'est pas encore implémenté. Le code de la version test est disponible dans l'archive `Backlight_Forecast_V1_alpha.zip` remise dans la conversation ; il n'est **pas encore entièrement publié dans ce dépôt**.

## Installation (après import du code)
1. Installer Node.js LTS.
2. Cloner ce dépôt.
3. Lancer `DEMARRER_WINDOWS.bat`.
4. Ouvrir http://127.0.0.1:4173

## Règles de référence
- Remplissage des groupes : 85 % par défaut.
- Sessions jouées : 65 % par défaut.
- PCVR : 1 PC client par casque, 1 serveur par installation, 1 AP pour 3 casques.
- Standalone : 1 AP par setup.
- Batteries : 1 dans le casque et 2 de rechange par casque.
- Chargeurs calculés uniquement sur les batteries de rechange.
- VBMS : une licence par HTC Focus 3 / Focus Vision.
- Devis matériel : marge commerciale de 30 % sur prix de vente HT, modifiable par item.
- Modes simple et avancé et modularité des calculs.

## Architecture cible
Dépôt indépendant, conçu pour une intégration ultérieure des moteurs dans `Utilitaire_SaaS`.

## Recette
Tests des calculs, de la sauvegarde, des exports et des cas réels avant la version stable.
