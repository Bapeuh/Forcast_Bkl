# Recette V1.4 Alpha — Configureur matériel

1. Ouvrir le projet de démonstration, puis **CAPEX & devis**.
2. Sélectionner une référence à quantité 12. Indiquer **Stock = 6**, **Location = 2**, laisser **Quantité retenue = 12**. Vérifier **À acheter = 4**.
3. Entrer un tarif de location et **Mois = 3**. Vérifier la variation du coût de location, sans modification des quantités de casques.
4. Renseigner un coût d'utilisation du stock et vérifier que le CAPEX achat reste inchangé.
5. Exporter les vues interne et client. Le devis client ne doit pas montrer de prix d'achat, de coût de revient ou de marge.
6. Supprimer le tarif de location : le devis client doit signaler que le coût est incomplet et ne pas être généré.
7. Vérifier que le module Flux, les expériences, les setups, la sauvegarde et les autres modules fonctionnent comme en V1.3.1.
8. Redémarrer l'application : les répartitions du projet doivent être conservées.

**Attention :** la notion de coût de location est un coût total sur le nombre de mois indiqué, et non une location client automatiquement facturée selon un contrat.
