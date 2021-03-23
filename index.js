/************** GLOBAL VARIABLES **************/

const travlerProfile = document.querySelector('#profile')
const image = document.querySelector('#profile > img')
const travlerName = document.querySelector('#profile > h2')
const travlerNickName = document.querySelector('#profile > em')
const travlerLikes = document.querySelector('#profile > p')
const likeButton = document.querySelector('#profile > button')

const animalsList = document.querySelector('#animals')

const animalSightingsForm = document.querySelector('#new-animal-sighting-form')

/************** URL's **************/
const travlerUrl = 'http://localhost:3000/travelers'
const animalSightingsUrl = 'http://localhost:3000/animalSightings'

/************** Rendering travler on webpage **************/
console.log(travlerName.innerText)

fetch(travlerUrl)
    .then(response => response.json())
    .then(travlers => {
        travlers.forEach(travler => {
            profile.dataset.id = travler.id
            image.src = travler.photo
            image.alt = travler.name
            travlerName.textContent = travler.name
            travlerNickName.textContent = travler.nickname
            travlerLikes.textContent = `${travler.likes} Likes`
        })
    })

/************** Rendering Animal sightings on webpage **************/
// function renderAllAnimalSightings() {
    fetch(animalSightingsUrl)
        .then(response => response.json())
        .then(animalSightings => {
            animalSightings.forEach(animalSighting => {
            renderAnimalSignting(animalSighting)
            })
        })
    // }

function renderAnimalSignting(animalSighting){
    const outerLi = document.createElement('li')
    outerLi.dataset.id = animalSighting.id

    outerLi.innerHTML = `
        <p>${animalSighting.description}</p>
        <img src=${animalSighting.photo} alt="${animalSighting.species}"/>
        <a href=${animalSighting.link} target='_blank'>Here's a video about the ${animalSighting.species} species!</a>
        <p class='likes-display'>${animalSighting.likes} Likes</p>
        <button class="like-button" type="button">Like</button>
        <button class="delete-button" type="button">Delete</button>
        <button class="toggle-update-form-button" type="button">Toggle Update Form</button>
        <form class="update-form" style="display: none;">
            <input type="text" value="${animalSighting.description}"/>
            <input type="submit" value="Update description">
        </form>
    `
    animalsList.append(outerLi)
}

/************** Add new Animal Sighting **************/

animalSightingsForm.addEventListener('submit', function(event){
    event.preventDefault()

    const species = animalSightingsForm.species.value
    const photo = animalSightingsForm.photo.value
    const link = animalSightingsForm.video.value
    const description = animalSightingsForm.description.value

    fetch(animalSightingsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({travelerId: 1, species, photo, link, description, likes: 0})
    })
        .then(response => response.json())
        .then(newAnimalSighting => {
            // pessimistic rendering - in this case better because we're
            // wanting the ID when we create the HTML for this card
            renderAnimalSignting(newAnimalSighting)
        })
    animalSightingsForm.reset
})

/************** Add Travler Likes **************/

likeButton.addEventListener('click', function(event){
    const newTravlerLikes = `${parseInt(travlerLikes.textContent) + 1} Likes`

    fetch(`${travlerUrl}/${travlerProfile.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ likes: newTravlerLikes })
        })
            .then(response => response.json())
            .then(data => travlerLikes.textContent = data.likes)
})

/************** Animal Sightings event listeners **************/

animalsList.addEventListener('click',function(event){
    const animalCard = event.target.closest('li')
    if (event.target.matches('button.like-button')){
        const animalLikes = event.target.previousElementSibling
        const newAnimalLikes = `${parseInt(animalLikes.textContent) + 1} Likes`
        
        fetch(`${animalSightingsUrl}/${animalCard.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ likes: newAnimalLikes })
        })
            .then(response => response.json())
            .then(data => animalLikes.textContent = data.likes)        
    }
    else if (event.target.matches('button.delete-button')){
        fetch(`${animalSightingsUrl}/${animalCard.dataset.id}`, {
            method: 'DELETE'
        })
        animalCard.remove()
    }
    else if (event.target.matches('button.toggle-update-form-button')){
        const form = event.target.nextElementSibling
            if (form.style.display === 'none'){
                form.style.display = 'block'
            }
            else{
                form.style.display = 'none'
            }  
            // form.addEventListener('submit', function(event){
            //     event.preventDefault()
            //     console.log(event.target)
            // })
        }
})
/************** Edit Animal description **************/
animalsList.addEventListener('submit',function(event){    
    if (event.target.matches('form')){
        event.preventDefault()
        const animalCard = event.target.closest('li')
        const newDescription = event.target.querySelector('input').value
        
        fetch(`${animalSightingsUrl}/${animalCard.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ description: newDescription })
        })
            .then(response => response.json())
            .then(data => animalCard.querySelector('p').textContent = data.description)
    }
    animalsList.reset
})
