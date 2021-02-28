class Utils {
    static moyenne(ratings){
        let somme= 0;
        if(ratings.length === 0){
            return 0;
        }
        for(let i=0; i<ratings.length; i++){
            somme += ratings[i].stars;

        }
        return somme / ratings.length;
    }

    static stringToSlug (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    static getPosition(askPosition = true){
        if(!askPosition){
            return Promise.resolve({ lat: 45.4387236, lng: 4.3851787 })
        }

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
}
