function initMap() {
    Utils
        .getPosition()
        .then((coords) => new App(coords, true))
}

