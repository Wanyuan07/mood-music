const moodWords = {
    "happy": ["happy", "joyful", "cheerful", "delighted", "overjoyed", "pleased", "satisfied", "thrilled"],
    "sad": ["sad", "unhappy", "depressed", "down", "heartbroken", "mournful", "disheartened"],
    "chill": ["chill", "relaxed", "calm", "laid-back", "peaceful", "cool"],
    "focus": ["focus", "concentrate", "productive", "motivated", "determined"],
    "party": ["party", "celebrate", "festive", "lively", "energetic", "gymming"],
    "sleepy": ["sleepy", "tired", "drowsy", "exhausted", "lethargic", "fatigued"]
}
let msg = document.getElementById("initial_msg");
let contain = document.getElementById("container");
let button = document.getElementsByClassName("btn");
let button_Search = document.getElementById("searchbtn");
let input = document.getElementById("searchbox");
let key = document.getElementById("keyboard")

// ----------------------------------------------------

input.addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        let mood = input.value;
        error(mood);
    }
})
for (let i = 0; i<button.length; i++)  {
    button[i].addEventListener("click", function() {
        let mood = this.innerText.split(" ")[0];
        error(mood);
    });
}
button_Search.addEventListener("click", function() {
    let mood = input.value;
    error(mood); 
})  

// ----------------------------------------------------

function error(mood) {
    contain.style.display = "none";
    if (!mood || mood.trim() == "") {
        msg.innerHTML = "Please enter a valid input.....";
        return;
    }
    mood = mood.toLowerCase().split(" ");
    let new_mood = Object.keys(moodWords).find(key => mood.some(word => moodWords[key].includes(word)));
    if (new_mood == undefined) {
        msg.innerHTML = `<div class="error">Sorry, I couldn't find that mood.<br>Try words like:  
                         <div class="moods">  
                             <span>Delighted</span>
                             <span>Energetic</span>
                             <span>Calm</span>
                             <span>Tired</span>
                             <span>Motivated</span>
                             <span>Sad</span>
                         </div></div>`;
        return;
    } else {
        song(new_mood); 
    }
}

// ----------------------------------------------------

let pastMood = localStorage.getItem("lastMood");
if (pastMood && pastMood.length > 0) {
    song(pastMood);
}

// ----------------------------------------------------

function song(mood) {
    contain.style.display = "grid";
    localStorage.setItem("mood", `${mood}`);
    document.getElementById("des").innerHTML = "Welcome to the Mood Music Selector!"
    msg.innerHTML = `<div class="loading"><img id="load" src="./images/loading.png" alt="Loading...">Searching for your songs.....</div>`;
    contain.innerHTML = "";
    // ----------------------------------------------------
    let token = "BQDCRAED9MaR_rpdhDgv8-RE-FShq_sWICotCv7_SjR62mQtnKpc-u1KM_jcYeHiGzsi4qBooclQZGemFuHpeX7Yrvc6IxJuJTiHlhO3v5zyj7R0pC1TgMlQ7vQk-7cO8kDRSr36tuUgxfBn2lmLYRSiLkzhpSobKZ4TO_3wrjCUBG4mPZjUtZl329ynWeiPtG5B2-C-OITBIT8Lq5moe0VNvT_jBb3JQ2c3RhGxd6febPjk3rWwwFM0R-1NXE0WaHFl0uilfcbzXV4xFuuoUZgr3DjKP3sMsusWSZ_1g1vsVKuZwzhwLpZZzO66z9APo32MmPMmHgn_yy2qA-gqO1gJ_mjxh7XzkpXx8qxGyJjvCz6PXD8wEOh8UYXEIBWrDvAmbMQxKVScrbb_c3V64lpbaj8BqnNe";
    let promise_playlist = fetch(`https://api.spotify.com/v1/search?q=${mood}%20songs&type=playlist`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    promise_playlist.then((response) => {
        return response.json();
    }).then((data) => {
        if(data.error && data.error.status == 401) {
            msg.innerHTML = "Token expired....";
            return;
        }
        let item_no = Math.round(Math.random() *9)
        let playlistLink = "";
        if (data.playlists.items[item_no] != null) {
            playlistLink = data.playlists.items[item_no].href;
        }
        else {
            playlistLink = data.playlists.items[0].href;
        }
        let promise_songs = fetch(`${playlistLink}/tracks?limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        promise_songs.then((response) => {
            return response.json()
        }).then((data) => {
            card(mood, data);
        })    
    }).catch((error) => {
        msg.innerHTML = "Network error. Please check your internet connection.....";
    })
}

// ----------------------------------------------------

let favorites = JSON.parse(localStorage.getItem("savedMusic")) || [];
function card(mood, data) {
    msg.innerHTML = `Top recommendations for ${mood}:<br>`;
    const num = localStorage.getItem("index") || Math.round(Math.random() * (data.items.length - 12)); 
    let i = num, cardNum = 0;
    while ( i < num + 10 && cardNum < 8) {
        let song_card = document.createElement("div");
        song_card.className = "song-info";
        let track = data.items[i].track;
        if (track == null) {
            i++;
            continue;
        }
        let songname = track.name;
        let songlink = track.external_urls.spotify;
        let image = "";
        if (track.album.images.length > 0) {
            image = track.album.images[0].url;
        }
        let artist = track.artists[0].name;
        let music = {
            name : `${songname}`,
            artist : `${artist}`,
            img : `${image}`,
            link : `${songlink}`,
        }
        song_card.innerHTML  += `<br><img class="album" src="${image}" width="300">
                                <br><a href="./songs.html" class="song_link">${songname}</a><br>${artist}`;
        favorites = JSON.parse(localStorage.getItem("savedMusic")) || [];
        if (favorites.some(song => song.link == music.link)) {
            song_card.innerHTML += `<button class="fav"><img class="fav-img" src="./images/fav.jpg"></button>`;
        }
        else {
            song_card.innerHTML += `<button class="fav"><img class="fav-img" src="./images/unfav.jpg"></button>`;
        }
        localStorage.removeItem("index");
        localStorage.removeItem("lastMood");
        cardNum++;
        i++;
        contain.appendChild(song_card);
        //------------------------------------------------
        song_card.querySelector(".fav").addEventListener("click", function() {
            if (song_card.querySelector(".fav-img").src.includes("unfav")) {
                song_card.querySelector(".fav-img").src = "./images/fav.jpg";    
                favorites = JSON.parse(localStorage.getItem("savedMusic")) || [];           
                favorites.push(music);
                localStorage.setItem("savedMusic", JSON.stringify(favorites));
            }
            else {
                song_card.querySelector(".fav-img").src = "./images/unfav.jpg";
                favorites = favorites.filter(song => song.link != music.link);
                localStorage.setItem("savedMusic", JSON.stringify(favorites));
                favorites = JSON.parse(localStorage.getItem("savedMusic")) || [];
            }
        })
        //------------------------------------------------
        song_card.querySelector(".song_link").addEventListener("click", function() {
            localStorage.setItem("playMusic", JSON.stringify(music));
            localStorage.setItem("last_page", "./home.html")
            localStorage.setItem("lastMood", `${mood}`);
            localStorage.setItem("index", `${num}`);
        })
        //------------------------------------------------
    }
}
   
// ----------------------------------------------------

if (localStorage.getItem("mood")) {
    document.getElementById("des").innerHTML = `Welcome Back. Ready for some ${localStorage.getItem("mood")} vibes again...... `;
}
else {
    document.getElementById("des").innerHTML = "Welcome to the Mood Music Selector! This app helps you find the perfect music for your current mood.";
}

// ----------------------------------------------------

let nav_bar = document.querySelector(".nav-bar");
let theme_img = document.querySelector(".theme-img");
let darkTheme = JSON.parse(localStorage.getItem("theme"));
if (!darkTheme) {
    theme_img.src = "./images/night.png";
    document.body.style.backgroundColor = "#c9a5f8";
    nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
}
document.getElementById("theme").addEventListener("click", function() {
    if (darkTheme) {
        theme_img.src = "./images/night.png";
        document.body.style.backgroundColor = "#c9a5f8";
        nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
        darkTheme = false;
    }
    else {
        theme_img.src = "./images/day.png";
        document.body.style.backgroundColor = "#100123";
        nav_bar.style.backgroundColor = "rgb(106, 133, 160)";
        darkTheme = true;
    }
    localStorage.setItem("theme", JSON.stringify(darkTheme));
})

// ----------------------------------------------------
