// select search button
var searchBtnEl = document.querySelector('#search-btn')

// select search input
var searchInputEl = document.querySelector('#search-input')

// select artist container
var artistContainerEl = document.querySelector('#similar-artist-container')

// find shows button
var showsBtnEl = document.createElement('button')

// target recent searches button
var recentSearchEl = document.querySelector('#recent-searches')

//select recent searched artist
var recentSearch = localStorage.getItem ("storedArtist")

// function to run recent searches
var searchRecentFunction = function () {
  if (recentSearch) {
    artistName = localStorage.getItem ("storedArtist")
    fetchTasteData(artistName);
  
  }
}

// search function
var submitSearch = function(event) {
    event.preventDefault();
    artistContainerEl.innerHTML = '';
    
    // get value from artist name input
    var artistName = searchInputEl.value.trim();

    if (artistName) {
        fetchTasteData(artistName);
        searchInputEl.value = "";

        // store input to local storage
        localStorage.setItem("storedArtist", artistName);
      
    } 
}


// search by enter btn
var pressEnter = document.getElementById('search-input');
pressEnter.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('search-btn').click();
  }
});


var fetchTasteData = function(artistName) {
  fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName}&api_key=924ac96deb482029a730219988aece0f&format=json`
  )
  .then(function(response) {

      return response.json();
    
  })
  .then(function(data) {

      let artistArray = data.similarartists.artist

      console.log(artistArray)
      
      displaySongPlayer(artistArray)

  })
}


// function to display artist
var displaySongPlayer = function(data) {

    var artistNameDisplay = document.querySelector('#searched-artist')
    artistNameDisplay.textContent = ''

    for (let i = 0; i < 5; i++) {

    // create artist background (li)
    var artistBackgroundEl = document.createElement('li')
    artistBackgroundEl.className = 'artist-background'
    artistBackgroundEl.setAttribute('id', 'container-' + i)

    // create p element and give it value of songTitle (searched term)
    var artistNameEl = document.createElement('p')
    artistNameEl.classList.add('song-details')
    artistNameEl.textContent = data[i].name

    // create container for buttons
    var btnContainerEl = document.createElement('div')
    btnContainerEl.classList.add('button-container')

    // create find shows button
    var showsBtnEl = document.createElement('a')
    showsBtnEl.classList.add('shows')
    showsBtnEl.textContent = 'Find Shows'
    showsBtnEl.setAttribute('href', './playPage.html?q=' + artistNameEl.textContent);

    // create trash button and icon
    var trashBtnEl = document.createElement('button')
    trashBtnEl.classList.add('trash')
    trashBtnEl.classList.add('far')
    trashBtnEl.classList.add('fa-trash-alt')
    // id for trash button so we can target to remove item
    trashBtnEl.setAttribute('id', 'button-' + i)
    trashBtnEl.addEventListener('click', function(e) {
      removeArtist(e, i)
    })

    // append elements to page
    artistContainerEl.appendChild(artistBackgroundEl)
    artistBackgroundEl.appendChild(artistNameEl)
    artistBackgroundEl.appendChild(btnContainerEl)
    btnContainerEl.appendChild(showsBtnEl)
    btnContainerEl.appendChild(trashBtnEl)

    }

}

var removeArtist = function(event, i) {

event.stopPropagation()
var element = document.getElementById('container-' + i)
var button = document.getElementById('button-' + i)

if (event.target === button) {
  element.remove()
}

}


// listen for search button click
searchBtnEl.addEventListener('click', submitSearch);

// listen for trash button click
artistContainerEl.addEventListener('click', removeArtist)

//listen for recent searches button click
recentSearchEl.addEventListener('click', searchRecentFunction)










