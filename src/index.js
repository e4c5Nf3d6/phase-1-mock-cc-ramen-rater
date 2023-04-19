// Definitions
const menu = document.querySelector('#ramen-menu')
const details = document.querySelector('#ramen-detail')
const detailImage = details.querySelector('.detail-image')
const detailName = details.querySelector('.name')
const detailRestaurant = details.querySelector('.restaurant')
const ratingDisplay = document.querySelector('#rating-display')
const commentDisplay = document.querySelector('#comment-display')
const form = document.querySelector('#new-ramen')
const editForm = document.querySelector('#edit-ramen')
const deleteBtn = document.querySelector('#delete-ramen')

// Callbacks
function loadMenu() {
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(data => {
        data.forEach(ramen => createMenuItem(ramen))

        detailImage.src = data[0].image
        detailName.textContent = data[0].name
        detailRestaurant.textContent = data[0].restaurant
        ratingDisplay.textContent = data[0].rating
        commentDisplay.textContent = data[0].comment
        editForm.className = `id-${data[0].id}`
        deleteBtn.className = `id-${data[0].id}`
        
    })
}

function createMenuItem(ramen) {
    let pic = document.createElement('img')
    pic.src = ramen.image
    menu.appendChild(pic)
    pic.className = `id-${ramen.id}`

    pic.addEventListener('click', () => {
        detailImage.src = ramen.image
        detailName.textContent = ramen.name
        detailRestaurant.textContent = ramen.restaurant
        ratingDisplay.textContent = ramen.rating
        commentDisplay.textContent = ramen.comment
        editForm.className = `id-${ramen.id}`
        deleteBtn.className = `id-${ramen.id}`
    })
}

function createNewRamen(e) {
    e.preventDefault()
    let newRamen = {
        "name": e.target.querySelector('#new-name').value,
        "restaurant": e.target.querySelector('#new-restaurant').value,
        "image": e.target.querySelector('#new-image').value,
        "rating": e.target.querySelector('#new-rating').value,
        "comment": e.target.querySelector('#new-comment').value        
    }

    fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRamen)
    })
    .then(res => res.json())
    .then(data => createMenuItem(data))

    form.reset()
}

function updateRamen(e) {
    e.preventDefault()
    let updatedRamen = {
        "rating": e.target.querySelector('#new-rating').value,
        "comment": e.target.querySelector('#new-comment').value        
    }     

    fetch(`http://localhost:3000/ramens/${e.target.className.at(-1)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRamen)
    })
    .then(() => {
        ratingDisplay.textContent = updatedRamen.rating
        commentDisplay.textContent = updatedRamen.comment
    })

    editForm.reset()
}

function deleteRamen(e) {
    let ramenId = e.target.className
    
    fetch(`http://localhost:3000/ramens/${ramenId.at(-1)}`, {method: 'DELETE'})
    .then(() => {
        menu.querySelectorAll('img').forEach(image => {
            if (image.className === ramenId) {
                image.remove()
            }
        })
    
        let firstRamen = menu.querySelector('img')
        firstRamen.click()
    })
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadMenu)
form.addEventListener('submit', createNewRamen)
editForm.addEventListener('submit', updateRamen)
deleteBtn.addEventListener('click', deleteRamen)
