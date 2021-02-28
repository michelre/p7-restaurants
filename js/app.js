class App {
    constructor(coords, fromFile) {
        this.allRestaurants = [];
        this.filter = new Filter(() => this.displayFilteredRestaurants());
        this.restaurantList = new RestaurantList([], (e, restaurant) => this.addCommentCallback(e, restaurant));
        this.googleMap = new GoogleMap((newRestaurant) => this.addRestaurantCallback(newRestaurant), coords);

        this.placesService = new PlacesService(this.googleMap, coords);
        this.placesService.getRestaurantsWithReviews(fromFile).then((data) => {

            this.allRestaurants = data;
            this.restaurantList.refreshRestaurants(data)
            this.googleMap.createMarkers(data)
        });

    }

    addCommentCallback(e, restaurant) {
        const mark = e.target.mark.value
        const comment = e.target.comment.value
        const rating = {
            stars: parseInt(mark),
            comment
        }
        for (let j = 0; j < this.allRestaurants.length; j++) {
            if (this.allRestaurants[j].restaurantName === restaurant.restaurantName) {
                this.allRestaurants[j].ratings.push(rating)
            }
        }

        $(`#addCommentModal-${Utils.stringToSlug(restaurant.restaurantName)}`).modal('hide')

        this.displayFilteredRestaurants() // On affiche le listing potentiellement déjà filtré
    }

    addRestaurantCallback(newRestaurant) {
        this.allRestaurants.push(newRestaurant)
        this.restaurantList.refreshRestaurants(this.allRestaurants)
        this.googleMap.createMarkers(this.allRestaurants)
    }

    displayFilteredRestaurants() {
        // On centralise la logique de filtrage des restaurants pour mettre à jour à la fois la liste et la carte
        const restaurantFiltered = []
        for (let i = 0; i < this.allRestaurants.length; i++) {
            const avg = Utils.moyenne(this.allRestaurants[i].ratings)

            if (avg >= parseInt(this.filter.min) && avg <= parseInt(this.filter.max)) {
                restaurantFiltered.push(this.allRestaurants[i])
            }
        }
        this.restaurantList.refreshRestaurants(restaurantFiltered)
        this.googleMap.createMarkers(restaurantFiltered)
    }
}
