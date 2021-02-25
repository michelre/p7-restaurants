let allRestaurants = [];

function initMap() {

    /**
     * Initialisation du composant de filtre
     */
    const filter = new Filter(displayFilteredRestaurants);

    /**
     * Initialisation du composant de listing de restaurant
     */
    const restaurantList = new RestaurantList([], addCommentCallback);

    /**
     * Initialisation du composant Map
     */
    const googleMap = new GoogleMap(addRestaurantCallback, { lat: 45.4387236, lng: 4.3851787 });
    

    $.ajax(
        {
            url: "restaurant2.json"
        }
    ).then(function (data) {
        allRestaurants = data;
        restaurantList.refreshRestaurants(data)
        googleMap.createMarkers(data)

    })

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
        allRestaurants.push(newRestaurant)
        restaurantList.refreshRestaurants(allRestaurants)
        googleMap.createMarkers(allRestaurants)  
    }
    
    function displayFilteredRestaurants(){
        // On centralise la logique de filtrage des restaurants pour mettre à jour à la fois la liste et la carte
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

