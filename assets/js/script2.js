// select concert container
var concertSectionEl = document.querySelector('#concert-display')

let concertData = {}
let searchedArtist = ''


var submitFindShows = function() {

    var queryString = document.location.search
    var artistName = queryString.split('=')[1];
    var artistName2 = artistName.toLowerCase()
    var urlParams = new URLSearchParams(window.location.search);
    searchedArtist = urlParams.get('q');

    if (searchedArtist) {
        fetchBandsData(searchedArtist)
    }

    if (artistName2) {
        fetchBandsData(artistName2)
    }

} 

var fetchBandsData = function(artistName2) {
    
    fetch(
        `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artistName2}&apikey=R0tQU57O6iaWtiawL9PILjWiGJKwKsTY`
    )
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if(data.page.totalElements = 0) {
            console.log('Artist does not have any upcoming shows on Ticketmaster')
        } else {
            let attractionId = data._embedded.attractions[0].id
            fetch(
                `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&apikey=R0tQU57O6iaWtiawL9PILjWiGJKwKsTY`
            )
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                let events = data._embedded.events
                events.sort((a, b) => new Date(a.dates.start.localDate) - new Date(b.dates.start.localDate));
                for (let i = 0; i < events.length; i++) {
                    concertData[i] = {
                        name: events[i].name,
                        date: events[i].dates.start.localDate,
                        url: events[i].url,
                        venue: events[i]._embedded.venues[0].name,
                        city: events[i]._embedded.venues[0].city.name
                    };
                }
                displayConcertDates()
            })
        }
    })
}

// function to display concert dates
var displayConcertDates = function() {

    var similarArtistName = document.querySelector('#similar-artist')
    similarArtistName.textContent = ''
    similarArtistName.textContent = searchedArtist + ' Upcoming Shows'

    var keys = Object.keys(concertData);

    // Select the ul element
    var concertContainerEl = document.querySelector('#concert-container');

    for (let i = 0; i < keys.length; i++) {
        
        var concertBackgroundEl = document.createElement('li')
        concertBackgroundEl.className = 'artist-background'

        var concertEl = document.createElement('p')
        concertEl.classList.add('song-details')
        concertEl.innerHTML = `${concertData[keys[i]].name} <br /> <strong>in</strong> ${concertData[keys[i]].city} 
                            <strong>on</strong> ${moment(concertData[keys[i]].date).format('M/D/Y')} 
                            <strong>at</strong> ${concertData[keys[i]].venue}`

        var infoBtnEl = document.createElement('a')
        infoBtnEl.classList.add('shows')
        infoBtnEl.textContent = 'See more info & get tickets'
        infoBtnEl.setAttribute("href", concertData[keys[i]].url);
        infoBtnEl.setAttribute("target", "_blank");

        // Append the li element to the ul element
        concertContainerEl.appendChild(concertBackgroundEl)
        concertBackgroundEl.appendChild(concertEl)
        concertBackgroundEl.appendChild(infoBtnEl)
    
    }

}

submitFindShows();














