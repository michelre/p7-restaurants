class Filter {

    constructor(submitFunction){

        this.min = 0;
        this.max = 5;

        const form = document.querySelector('#filter-form')
        form.addEventListener("submit", (event) => {
            event.preventDefault()
            this.min = event.target.min.value //event.target = noeud html form. On récupère sur ce form la valeur du champs min
            this.max = event.target.max.value
            submitFunction()
        }); 
    }

}