let allRestaurants = [];

function initMap() {

    
    /**
     * Permet de récupérer la position du navigateur
     * Fonction qui renvoie une promesse
     */
    getPosition().then(coords => {
        // Cas du succès dans le cas ou la promesse est résolue
        console.log(coords)
        /**
         * Init du composant de filtre
         */
        const filter = new Filter(displayFilteredRestaurants);

        /**
         * Init du composant de listing de restaurant
         */
        const restaurantList = new RestaurantList([], addCommentCallback);

        /**
         * Init du composant Map
         */    
        const googleMap = new GoogleMap(addRestaurantCallback, coords);
        
        
        //Initialisation du service google places qui permet de récupérer le listing de restaurants et leurs avis              
        const placesService = new PlacesService(googleMap, coords);

        placesService.getRestaurantsWithReviews().then((data) => {
            // On a récupéré tous les restaurants. On les garde dans une variable allRestaurants et on affiche la liste à gauche et les markers sur la carte à droite
            allRestaurants = data;
            restaurantList.refreshRestaurants(data)
            googleMap.createMarkers(data)
        });

    }, function(err){
        console.log(err)
        //Fonction d'erreur dans le cas ou une erreur s'est produite par exemple lors d'un appel à une API qui a renvoyé une erreur 500
    })
    
    function getPosition(){
        // Création de l'objet promesse
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                /* la géolocalisation est disponible */
                
                navigator.geolocation.getCurrentPosition(function(position){                    
                    resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
                }, function(error){
                    // On ne rejette pas la promesse, mais on la résoud avec des coordonées par défaut
                    resolve({ lat: 45.4387236, lng: 4.3851787 })
    
                })
              } else {
                  
                resolve({ lat: 45.4387236, lng: 4.3851787 })
              }
        })
    }


    function addCommentCallback(e, restaurant) {
        const mark = e.target.mark.value
        const comment = e.target.comment.value
        const rating = {
            stars: parseInt(mark),
            comment // Equivalent à comment: comment car variable du meme nom que la clé de mon objet
        }
        for(let j = 0; j < allRestaurants.length; j++){
            if(allRestaurants[j].restaurantName === restaurant.restaurantName){
                allRestaurants[j].ratings.push(rating)
            }
        }

        $(`#addCommentModal-${Utils.stringToSlug(restaurant.restaurantName)}`).modal('hide')
        
        displayFilteredRestaurants() // On affiche le listing potentiellement déjà filtré
    }

    function addRestaurantCallback(newRestaurant){
        // Lors de l'ajout du restaurant, on l'ajoute à la variable globale de tous les restaurants et on rafraichit le listing + les marqueurs
        allRestaurants.push(newRestaurant)
        restaurantList.refreshRestaurants(allRestaurants)
        googleMap.createMarkers(allRestaurants)  
    }
    
    function displayFilteredRestaurants(){
        
        const restaurantFiltered = []
        for(let i = 0; i < allRestaurants.length; i++){
            const avg = Utils.moyenne(allRestaurants[i].ratings)
            
            if(avg >= parseInt(filter.min) && avg <= parseInt(filter.max)){
                restaurantFiltered.push(allRestaurants[i])
            }
        }
        restaurantList.refreshRestaurants(restaurantFiltered)
        googleMap.createMarkers(restaurantFiltered)
    }
}

