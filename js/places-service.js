class PlacesService {

    constructor(googleMap, coords){
        this.coords = coords;
        this.service = new google.maps.places.PlacesService(googleMap.map);
    }

    getRestaurantsWithReviews(){
        return this.getRestaurants()
        .then((restaurants) => {
            const promisesReviews = [];
            for(let i = 0; i < restaurants.length; i++){
                // Pour chaque restaurant, on va récupérer ses avis sous forme de promesse
                const reviews = this.getReviewsByRestaurant(restaurants[i])
                promisesReviews.push(reviews)                
            }            
            // On attend que tous les avis soient résolus pour associer les avis aux restaurants
            return Promise.all(promisesReviews).then(reviews => ({ restaurants, reviews }))
        })
        .then(function(data) {
            for(let i = 0; i < data.restaurants.length; i++){
                const ratings = [];                
                for(let j = 0; j < data.reviews[i].length; j++){
                    
                    const rating = {
                        stars: data.reviews[i][j].rating,
                        comment: data.reviews[i][j].text,
                    }

                    ratings.push(rating)
                }
                data.restaurants[i]['ratings'] = ratings
            }
            return data.restaurants
        })
    }

    /**
     * On récupère le listing des restaurants
     */
    getRestaurants(){
        return new Promise((resolve) => {
            this.service.nearbySearch({
                location: new google.maps.LatLng(this.coords.lat, this.coords.lng),
                radius: '500',
                type: ['restaurant']
            }, function(restaurants){
                const data = [];
                for(let i = 0; i < restaurants.length; i++){
                    
                        const restaurant = {
                            "place_id" : restaurants[i].place_id,
                            "restaurantName": restaurants[i].name,
                            "address":restaurants[i].vicinity,
                            "lat":restaurants[i].geometry.location.lat(),
                            "long":restaurants[i].geometry.location.lng(),
                            "ratings":[
                               
                            ]
                         }
                    
                     data.push(restaurant)             
                }
                resolve(data)
            
        })
    })

    }

    /**
     * On récupère tous les avis d'un restaurant
     * 
     */
    getReviewsByRestaurant(restaurant) {
        return new Promise((resolve) => {            
            this.service.getDetails({placeId: restaurant.place_id, fields: ['review']}, function(result) {            
                if(result){
                    resolve(result.reviews || [])
                }   else {
                    resolve([])
                }              
            })
        })
    }

}