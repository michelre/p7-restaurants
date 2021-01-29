let allRestaurants = [];

function initMap() {

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
    const googleMap = new GoogleMap(addRestaurantCallback);
    

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

