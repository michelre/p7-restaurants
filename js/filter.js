/**
 * Composant qui permet de contrôler les 2 champs select au dessus du listing
 */
class Filter {

    constructor(submitFunction){
        this.min = 0;
        this.max = 5;

        // On crée l'évènement d'envoi du formulaire de filtre
        const form = document.querySelector('#filter-form')
        form.addEventListener("submit", (event) => {
            event.preventDefault()
            this.min = event.target.min.value
            this.max = event.target.max.value
            submitFunction()
        }); 
    }

}