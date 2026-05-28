let storage = localStorage.getItem("savedMusic");
let music = JSON.parse(storage);
console.log(music);
console.log(typeof(music));
console.log(music.length);

if (!music || music.length == 0) {
    document.getElementById("ini_msg").style.display = "block";
    document.getElementById("part").style.display = "none";
}
else {
    document.querySelector(".msg").innerHTML = "Your favs......";
    music.forEach(song => fav(song))
}

//------------------------------------------------------------------

function fav(song) {
    let songData = {
        name:  `${song.name}`,
        img : `${song.img}`,
        artist : `${song.artist}`,
        link : `${song.link}`
    } 
    let songCard = document.createElement("div");
    songCard.className = "card";
    songCard.innerHTML += `<br><img class="img" src="${songData.img}"><br> 
                           <a href="./songs.html" class="song-link">${songData.name}</a><br>${songData.artist}
                           <button class="fav-btn"><img class="fav-img" src="./images/fav.jpg"></button>`
    document.getElementById("container").appendChild(songCard);
    //------------------------------------------------
    songCard.querySelector(".fav-btn").addEventListener("click", function() {
        music = music.filter(song => song.link != songData.link);
        localStorage.setItem("savedMusic", JSON.stringify(music));
        songCard.remove();
        if (music.length == 0) {
            document.getElementById("ini_msg").style.display = "block";
            document.getElementById("part").style.display = "none";
        }
    })
    //------------------------------------------------
    songCard.querySelector(".song-link").addEventListener("click", function() {
        localStorage.setItem("playMusic", JSON.stringify(songData));
        localStorage.setItem("last_page", "./playlist.html");
    })
}

//------------------------------------------------------------------

let theme_img = document.querySelector(".theme-img");
let nav_bar = document.querySelector(".nav-bar");
let dark = JSON.parse(localStorage.getItem("theme"));
if (!dark) {
    document.body.style.backgroundColor = "#c9a5f8";
    nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
    theme_img.src = "./images/night.png"; 
}
document.getElementById("theme").addEventListener("click", function() {
    if (dark) {
        document.body.style.backgroundColor = "#c9a5f8";
        nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
        theme_img.src = "./images/night.png";
        dark = false;
    }
    else {
        document.body.style.backgroundColor = "#100123";
        nav_bar.style.backgroundColor = "rgb(106, 133, 160)";
        theme_img.src = "./images/day.png";
        dark = true;
    }
    localStorage.setItem("theme", JSON.stringify(dark));
})

//------------------------------------------------------------------

let input = document.getElementById("searchbox");
let btn =  document.getElementById("searchbtn");
btn.addEventListener("click", function() {
    let search = input.value.toLowerCase();
    value(search);
})
input.addEventListener("keydown", function(event) {
    if(event.key == "Enter") {
        let search = input.value.toLowerCase();
        value(search);
    }
})

//------------------------------------------------------------------

function value(search) {
    search = search.split(" ");
    let key_word = music.filter(song => search.some(word => song.name.toLowerCase().split(" ").includes(word)));
    console.log(key_word);
    if (key_word.length > 0) {
        input.value = "";
        document.querySelector(".msg").innerHTML = `<button class="back-btn">
                                                        <img src="./images/back.png" class="back-img">
                                                    </button> 
                                                    Your search result....`;
        document.getElementById("container").innerHTML = "";
        document.querySelector(".back-btn").addEventListener("click", function() {
            window.location.href = "./playlist.html";
        })
        fav(key_word[0]);
    }
    else {
        input.value = "";
        document.getElementById("ini_msg").style.display = "block";
        document.getElementById("part").style.display = "none";
        document.getElementById("ini_msg").innerHTML = "No such song found....";
        setTimeout(() => {
            window.location.href = "./playlist.html";
        }, 2000);
    }
}
