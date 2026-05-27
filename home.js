const playlists = {
    "happy": "6wDEibCHYjsbLen2VrIPtt",
    "sad": "189Sow1xr7R94oSKs4kISc",
    "chill": "6hQSibEcPYWfiQ3pTxfXCK", 
    "focus": "1eXFUaMJ9NGa3hzhi2H8TX",
    "party": "1SX3oHTD0iRZM4c7TXZKL9",  
    "sleepy": "0Uqdp1V2ytdrfIoAGQYslS"
}
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
    if (!mood || mood == " ") {
        msg.innerHTML = "Please enter a valid input.....";
        return;
    }
    mood = mood.toLowerCase().split(" ");
    let new_mood = Object.keys(moodWords).find(key => mood.some(word => moodWords[key].includes(word)));
    if (new_mood == undefined) {
        msg.innerHTML = "Mood not available. Please try another one.....";
        return;
    }
    else {
        song(new_mood);
    }
}

// ----------------------------------------------------

pastMood = localStorage.getItem("lastMood");
if (pastMood && pastMood.length > 0) {
    song(pastMood);
}

// ----------------------------------------------------

function song(mood) {
    contain.style.display = "grid";
    let playlistId = playlists[mood];
    localStorage.setItem("mood", `${mood}`);
    document.getElementById("des").innerHTML = "Welcome to the Mood Music Selector!"
    msg.innerHTML = "Loading...........";
    contain.innerHTML = "";
    let token = "BQDAujF5cU034gSX9FOjIPwuI99-NkguWR3J2KXKRXRg6ZXWZoJ4ORVaeGBnrcIRy2hbvVUb5Lc3tWErBBAVi7c3V0MAFhB-oDXHNkrAwb3Dg8ujWIlPNVWX6GduRQjReF9i6xW3dfY-_syvCKFS_NrfpR4FpzePdVuQNxYT1vOaL9hDZXn0nyTydH4RlqO1AVLcmOHLRADH3LWVie3qTOJTm0GtpA0svw--f1RPCEQTfnCkMkYcsRk-aiJZ6giM_S7QeRj_qBv6ouLk39fj-MOXFJz45OFJ1wiYsB8nhbfOW9zVk9DqpOU573tLR2_vlmJMn3Xmr8YEvsWYzy5tCTjhKWmncpmMfadReGi2FBBv9wWXHc3fwPtxf74x9pxlkMLxMIRl_Ub8SZy8l_pnw027AZLQm8go";
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
        if (localStorage.getItem)
        card(mood, data);
    })
}

// ----------------------------------------------------

let favorites = JSON.parse(localStorage.getItem("savedMusic")) || [];
function card(mood, data) {
    msg.innerHTML = `Top recommendations for ${mood}:<br>`;
    const num = localStorage.getItem("index") || Math.round(Math.random() * 40); 
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
        localStorage.setItem("lastMood", "");
        localStorage.setItem("index", "");
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
console.log(favorites);

// ----------------------------------------------------
