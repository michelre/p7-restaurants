class GoogleMap {

    constructor(addRestaurantCallback, coords){        
        /**
         * Initialisation de la popup
         */
        this.coords = coords;
        this.googleMapPopup = new GoogleMapPopup(google, this)
        this.initMap();
        this.addRestaurantEvent(addRestaurantCallback);
        this.markers = [];
        this.popups = [];
    }


    initMap(){
        
        this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 14,
            center: this.coords,
        });
    
        // Au click sur la carte, on affiche la modal qui permet d'ajouter un nouveau restaurant
        this.map.addListener('click', (e) => {
            if(this.popups.length){
                for(let i = 0; i < this.popups.length; i++){
                    this.popups[i].containerDiv.style.visibility = 'hidden';
                }
                this.popups = []
                return;
            }
                        
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({location: e.latLng}, function(results, status){
                if(status === 'OK' && results[0]){
                    $('#addRestaurantModal').modal('show')
                    $('#addRestaurantModal input[name="lat"]').val(e.latLng.lat())
                    $('#addRestaurantModal input[name="lng"]').val(e.latLng.lng())
                    $('#addRestaurantModal input[name="address"]').val(results[0].formatted_address)
                }
            })
        })
    }

    addRestaurantEvent(addRestaurantCallback){
        const formAddRestaurant = document.querySelector('#modal-add')
        formAddRestaurant.addEventListener('submit', function(event) {
            event.preventDefault();

            const restaurantName = event.target.name.value
            const address = event.target.address.value
            const lat = parseFloat(event.target.lat.value)
            const long = parseFloat(event.target.lng.value)
            $('#addRestaurantModal').modal('hide')
            addRestaurantCallback({
                restaurantName, address, lat, long, ratings: []
            })
        })
    }

    createMarkers(data){
        for(let i = 0; i < this.markers.length; i++){
            this.markers[i].setMap(null)
        }
        this.markers = []
        for (let i = 0; i < data.length; i++) {
            const marker = new google.maps.Marker({
                position: { lat: data[i].lat, lng: data[i].long },
                map: this.map,
            });

            marker.addListener('click', (e) => {            
                this.googleMapPopup.drawPopup(e.latLng, data[i], this.map)
            })

            this.markers.push(marker)
        }
    }

    // Initialisation de la variable this.popups qu'on appellera depuis googleMapPopup
    setPopups(popups) {
        this.popups = popups
    }
}