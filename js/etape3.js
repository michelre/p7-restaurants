let allRestaurants = [];

function initMap() {

    
    /**
     * Permet de récupérer la position du navigateur
     */
    let filter = null;
    let restaurantList = null;
    let googleMap = null;
    let placesService = null;
    getPosition().then(coords => {
        filter = filter = new Filter(displayFilteredRestaurants);

        restaurantList = new RestaurantList([], addCommentCallback);
 
        googleMap = new GoogleMap(addRestaurantCallback, coords);
                 
        placesService = new PlacesService(googleMap, coords);

        placesService.getRestaurantsWithReviews().then((data) => {

            allRestaurants = data;
            restaurantList.refreshRestaurants(data)
            googleMap.createMarkers(data)
        });

    }, function(err){
        console.log(err)

    })
    
    function getPosition(){

        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                /* la géolocalisation est disponible */
                
                navigator.geolocation.getCurrentPosition(function(position){                    
                    resolve({ lat: position.coords.latitude, lng: position.coords.longitude })
                }, function(error){
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
            comment
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

