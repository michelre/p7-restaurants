function initMap() {
    Utils
        .getPosition(false)
        .then((coords) => new App(coords, true))
}

