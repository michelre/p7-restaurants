class RestaurantList {
    
constructor(restaurants, addCommentCallback){
    this.restaurants = restaurants;
    this.addCommentCallback = addCommentCallback
}

refreshRestaurants(restaurants){
    this.restaurants = restaurants;
    this.createList();
}

createList(){
    const data = this.restaurants;
    const listRestaurant = document.querySelector("#list-restaurant")
    let li = '';
    const body = document.querySelector('body');

    for (let i = 0; i < data.length; i++) {
        

        if(document.querySelector(`#commentModal-${Utils.stringToSlug(data[i].restaurantName)}`)){
        document.querySelector(`#commentModal-${Utils.stringToSlug(data[i].restaurantName)}`).remove()
        }

        if(document.querySelector(`#addCommentModal-${Utils.stringToSlug(data[i].restaurantName)}`)){
        document.querySelector(`#addCommentModal-${Utils.stringToSlug(data[i].restaurantName)}`).remove()
        }
        
    
        const divModal = this.createCommentModal(data[i]);
        const divAddCommentModal = this.createAddCommentModal(data[i]);
        body.appendChild(divModal)
        body.appendChild(divAddCommentModal)

        const formAddComment = document.querySelector(`#form-add-comment-${Utils.stringToSlug(data[i].restaurantName)}`)
        if(formAddComment){
            formAddComment.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addCommentCallback(e, data[i])
            })
        }
        


        li += `<li class="border mb-4 py-2 px-4">
            <div>${data[i].restaurantName}</div>
            <div>${data[i].address}</div>
            <div class="my-rating-${Utils.stringToSlug(data[i].restaurantName)}"></div>
            <div class="d-flex mt-3">
                <button type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#commentModal-${Utils.stringToSlug(data[i].restaurantName)}">Voir les commentaires</button>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCommentModal-${Utils.stringToSlug(data[i].restaurantName)}">Ajouter un commentaire</button>
            </div>
            
        </li>`  
        
        setTimeout(function(){
            $(".my-rating-" + Utils.stringToSlug(data[i].restaurantName)).starRating({
                starSize: 25,
                initialRating: Utils.moyenne(data[i].ratings),
                readOnly: true
            });
        }, 0);
        
    }
    listRestaurant.innerHTML = "<ul>" + li + "</ul>"

}


createCommentModal(restaurant){
    const listComments = `<ul>${restaurant.ratings.map(rating => `<li>${rating.comment}</li>`).join('')}</ul>`
    const divModal = document.createElement('div')
    divModal.setAttribute('id', `commentModal-${Utils.stringToSlug(restaurant.restaurantName)}`)
    divModal.setAttribute('class', 'modal fade')

    divModal.innerHTML += `<div tabindex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="commentModalLabel">Commentaires ${restaurant.restaurantName}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        ${(restaurant.ratings.length === 0) ? 'Pas de commentaire' : listComments}                
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>        
        </div>
      </div>
    </div>
  </div>`
  return divModal;
}

createAddCommentModal(restaurant){

    const divAddCommentModal = document.createElement('div')
    divAddCommentModal.setAttribute('id', `addCommentModal-${Utils.stringToSlug(restaurant.restaurantName)}`)
    divAddCommentModal.setAttribute('class', 'modal fade')

    divAddCommentModal.innerHTML += `<div tabindex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form class="modal-content" id="form-add-comment-${Utils.stringToSlug(restaurant.restaurantName)}">
        <div class="modal-header">
          <h5 class="modal-title" id="commentModalLabel">Ajout d'un commentaire: ${restaurant.restaurantName}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="form-group"> 
                <label>Note</label>
                <select name="mark" class="form-control">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div> 
            <div class="form-group"> 
                <label>Commentaire</label>
                <textarea name="comment" rows="5" placeholder="Commentaire" class="form-control" required></textarea>
            </div> 
        </div>
        <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Ajouter</button>  
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>        
        </div>
      </form>
    </div>
  </div>`
  return divAddCommentModal;
}

}