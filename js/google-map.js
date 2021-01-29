class GoogleMap {

    constructor(addRestaurantCallback){
        /**
         * Initialiser la popup (la variable google.map est disponible car on est dans la fonction initMap)
         */
        this.googleMapPopup = new GoogleMapPopup(google)
        this.initMap();
        this.addRestaurantEvent(addRestaurantCallback);
    }


    initMap(){
        this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: { lat: 45.4240885, lng: 4.2962536 },
        });
    
        this.map.addListener('click', function(e){
            if(popups.length){
                for(let i = 0; i < popups.length; i++){
                    popups[i].containerDiv.style.visibility = 'hidden';
                }
                popups = []
                return;
            }
                        
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({location: e.latLng}, function(results, status){
                if(status === 'OK' && results[0]){
                    $('#addRestaurantModal').modal('show')
                    $('#addRestaurantModal input[name="lat"]').val(e.latLng.lat())
                    $('#addRestaurantModal input[name="lng"]').val(e.latLng.lng())
                    $('#addRestaurantModal input[name="address"]').val(results[0].formatted_address)
                } else {
                    //TODO: Déclencher le cas d'erreur
                }
                console.log(results, status)
            })
        })
    }

    addRestaurantEvent(addRestaurantCallback){
        const formAddRestaurant = document.querySelector('#modal-add')
        formAddRestaurant.addEventListener('submit', function(event) {
            event.preventDefault();

            const restaurantName = event.target.name.value // Récupérer la valeur du champs input qui porte l'attribut name="name" . event.target = form HTML
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
        for(let i = 0; i < markers.length; i++){
            markers[i].setMap(null)
        }
        markers = []
        for (let i = 0; i < data.length; i++) {
            const marker = new google.maps.Marker({
                position: { lat: data[i].lat, lng: data[i].long },
                map: this.map,
            });

            marker.addListener('click', (e) => { 
                //Fonction flechée car si fonction normale le contexte "this" aurait été surchargé et la variable this.googleMapPopup n'aurait pas été trouvée dans ce nouveau contexte               
                this.googleMapPopup.drawPopup(e.latLng, data[i], this.map)
            })

            markers.push(marker)
        }
    }
}