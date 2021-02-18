Ligne de commande terminal pour démarrer le serveur local (se mettre dans le dossier du projet dans un premier temps)

php -S localhost:9090 -t .

Ajouter map Google avec des marker :

https://developers.google.com/maps/documentation/javascript/adding-a-google-map

## Documentation

- Initialisation est conditionnée au chargement de la librairie Maps
- Une fois la librairie chargée, appel de la fonction initMap (paramètre callback lors de l'appel à la librairie dans le HTML)
- Fonction initMap définit dans les fichiers index.js (étapes 1 & 2), etape3.js
- Fichier index.js = point d'entrée des étapes 1 & 2
- Fichier etpae3.js = point d'entrée des étapes 3
- Promesse = Une promesse représente une valeur qui peut être disponible maintenant, dans le futur voire jamais.
- Pour accéder à la valeur d'une promesse, on passe par


## Soutenance
- Montrer l'architecture et l'organisation des fichiers et le découpage par composant
- Montrer les points d'entrée: index.js pour les étapes 1 & 2 / etape3.js pour l'étape 3
- Présenter l'ordre des appels dans etape3.js (GLOBAL)
    1/ Présenter la création des composants
    2/ Présenter la récupération des restaurants avec PlacesService: Introduire la récupération de la position du navigateur
    3/ Présenter l'affichage des restaurants dans le composant liste et carte
- Présenter la problématique de récupération des restaurants depuis Google Places
    0/ On souhaite récupérer les données des restaurants formatées comme à l'étape 1 & 2 (présenter le fichier restaurant2.json)
    1/ On récupère un listing de restaurants sans les avis
    2/ Sur chaque restaurant, on récupère les avis et les notes associés


    

 