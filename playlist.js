

let storage = localStorage.getItem("savedMusic");
let music = JSON.parse(storage);
if (!music || music.length == 0) {
    document.getElementById("ini_msg").style.display = "block";
    document.getElementById("part").style.display = "none";
}
else {
    document.querySelector(".msg").innerHTML = "Your favs......";
    music.forEach(song => fav(song))
}


function fav(song) {
    let music = {
        name:  `${song.name}`,
        img : `${song.img}`,
        artist : `${song.artist}`,
        link : `${song.link}`
    } 
    songCard = document.createElement("div");
    songCard.className = "card";
    songCard.innerHTML += `<br><img class="img" src="${music.img}"><br> 
                           <a href="./songs.html" class="song-link">${music.name}</a><br>${music.artist}
                           <button class="fav-btn"><img class="fav-img" src="./images/fav.jpg"></button>`
    document.getElementById("container").appendChild(songCard);
    //------------------------------------------------
    songCard.querySelector(".fav-btn").addEventListener("click", function() {
        music = music.filter(song => song.link != link);
        localStorage.setItem("savedMusic", JSON.stringify(music));
        songCard.remove();
        if (music.length == 0) {
            document.getElementById("ini_msg").style.display = "block";
            document.getElementById("part").style.display = "none";
        }
    })
    //------------------------------------------------
    songCard.querySelector(".song-link").addEventListener("click", function() {
        localStorage.setItem("playMusic", JSON.stringify(music));
        localStorage.setItem("last_page", "./playlist.html");
    })
}


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


