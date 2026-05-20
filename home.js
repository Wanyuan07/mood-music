const playlists = {
    "happy": "6wDEibCHYjsbLen2VrIPtt",
    "sad": "189Sow1xr7R94oSKs4kISc",
    "chill": "6hQSibEcPYWfiQ3pTxfXCK", 
    "focus": "1eXFUaMJ9NGa3hzhi2H8TX",
    "party": "1SX3oHTD0iRZM4c7TXZKL9",  
    "sleepy": "0Uqdp1V2ytdrfIoAGQYslS"
}
let msg = document.getElementById("initial_msg");
let contain = document.getElementById("container");
let button = document.getElementsByClassName("btn");
let button_Search = document.getElementById("searchbtn");
let input = document.getElementById("searchbox");
let key = document.getElementById("keyboard")

input.addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        let mood = input.value;
        error(mood);
    }
})
for (let i = 0; i<button.length; i++)  {
    button[i].addEventListener("click", function() {
        let mood = this.innerText.split(" ")[0];
        song(mood);
    });
}
button_Search.addEventListener("click", function() {
    let mood = input.value;
    error(mood); 
})  



function song(mood) {
    let obj = mood.toLowerCase();
    let playlistId = playlists[obj];
    if (!playlistId) {
        msg.innerHTML = "Mood not available....."
        return;
    }
    msg.innerHTML = "Loading...........";
    contain.innerHTML = "";
    const token = "YOUR_TOKEN"
    let promise = fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    promise.then((response) => {
        // console.log(response);
        return response.json()
    }).then((data) => {
        // console.log(data);
        if(data.error && data.error.status == 401) {
            msg.innerHTML = "Token expired....";
            return;
        }
        card(mood, data);
    })
}

function error(mood) {
    if (mood == " " || mood == "") {
        msg.innerHTML = "Please enter a valid input....";
        return;
    }
    else {
        song(mood);
    }
}

function card(mood, data) {
    msg.innerHTML = `Top recommendations for ${mood}:<br>`;
    const num = Math.round(Math.random() * 40); 
    for (let i = num; i < num + 8; i++) {
        let song_card = document.createElement("div");
        song_card.className = "song-info";
        let track = data.items[i].track;
        let songname = track.name;
        let songlink = track.external_urls.spotify;
        let image = "";
        if (track.album.images.length > 0) {
            image = track.album.images[0].url;
        }
        let artist = track.artists[0].name;
        song_card.innerHTML += `<br><img src="${image}" width="300">`;
        song_card.innerHTML += `<br><a href="${songlink}" target="_blank">${songname}</a><br>${artist}<br>`;
        contain.appendChild(song_card);
    }
}
