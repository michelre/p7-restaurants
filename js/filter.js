/**
 * Composant qui permet de contrôler les 2 champs select au dessus du listing
 */
class Filter {

    // On passe une fonction en paramètre du constructeur. Fonction qui sera appelée lors de l'envoi du formulaire
    constructor(submitFunction){
        // On définit 2 attributs (min et max)
        this.min = 0;
        this.max = 5;

        // On crée l'évènement d'envoi du formulaire de filtre
        const form = document.querySelector('#filter-form')
        form.addEventListener("submit", (event) => {
            event.preventDefault()
            this.min = event.target.min.value //event.target = noeud html form. On récupère sur ce form la valeur du champs min
            this.max = event.target.max.value
            //L'appel de la fonction permet d'appeler la fonction définit dans index.js ou etape3.js
            submitFunction()
        }); 
    }

}