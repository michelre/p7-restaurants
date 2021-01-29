function GoogleMapPopup(google){


    class Popup extends google.maps.OverlayView {
        constructor(position, content) {
            super();            
            this.position = position;
            content.classList.add("popup-bubble");
            // This zero-height div is positioned at the bottom of the bubble.
            const bubbleAnchor = document.createElement("div");
            bubbleAnchor.classList.add("popup-bubble-anchor");
            bubbleAnchor.appendChild(content);
            // This zero-height div is positioned at the bottom of the tip.
            this.containerDiv = document.createElement("div");
            this.containerDiv.classList.add("popup-container");
            this.containerDiv.appendChild(bubbleAnchor);
            // Optionally stop clicks, etc., from bubbling up to the map.
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
            console.log(this.position);
        }
        // Called when the popup is added to the map.
        onAdd() {
            this.getPanes().floatPane.appendChild(this.containerDiv);
        }
        // Called when the popup is removed from the map. 
        onRemove() {
            if (this.containerDiv.parentElement) {
                this.containerDiv.parentElement.removeChild(this.containerDiv);
            }
        }
        // Called each frame when the popup needs to draw itself.
        draw() {
            const divPosition = this.getProjection().fromLatLngToDivPixel(
                this.position
            );
            // Hide the popup when it is far out of view.
            const display =
                Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
                    ? "block"
                    : "none";
    
            if (display === "block") {
                this.containerDiv.style.left = divPosition.x + "px";
                this.containerDiv.style.top = divPosition.y + "px";
            }
    
            if (this.containerDiv.style.display !== display) {
                this.containerDiv.style.display = display;
            }
        }
    }

    /**
     * On attache la fonction drawPopup au contexte de la function GoogleMapPopup afin que la fonction soit accessible de l'extérieur
     */
    this.drawPopup = function(latLng, restaurant, map){
        const popupContent=document.createElement("div")
        popupContent.innerHTML= `
            <div>
                <h2>${restaurant.restaurantName}</h2>
                <h3> Note moyenne : 
                    <div class="my-rating-${Utils.stringToSlug(restaurant.restaurantName)}"></div>
                </h3>
                <img style="height: 100px;" src="https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${restaurant.lat},${restaurant.long}&fov=80&heading=70&pitch=0&key=AIzaSyBDUNetyL3ydc7HBVvK2DFIhNZ1veToQ50"/>
                
            </div>
        `

        popup = new Popup(
            latLng,
            popupContent
        );
        popup.setMap(map);
        popups.push(popup)

        setTimeout(function(){
            $(".my-rating-" + Utils.stringToSlug(restaurant.restaurantName)).starRating({
                starSize: 25,
                initialRating: Utils.moyenne(restaurant.ratings),
                readOnly: true
            });
        }, 1000);
    }
}