let storage = localStorage.getItem("savedMusic");
let music = JSON.parse(storage);
if (!music || music.length == 0) {
    document.querySelector(".ini_msg").innerHTML = "Save songs to view this page...";
    document.getElementById("part").style.display = "none";
}
else {
    document.querySelector(".msg").innerHTML = "Your favs......"
}


for (let i = 0; i<music.length; i++) {
    let name = music[i].name;
    let img = music[i].img;
    let artist = music[i].artist;
    let link = music[i].link;
    let songCard = document.createElement("div");
    songCard.className = "card";
    songCard.innerHTML += `<br><img class="img" src="${img}"><br>`; 
    songCard.innerHTML += `<a href="${link}" target="_blank">${name}</a><br>${artist}`
    songCard.innerHTML += `<button class="fav-btn"><img class="fav-img" src="./images/fav.jpg"></button>`
    document.getElementById("container").appendChild(songCard);
    songCard.querySelector(".fav-btn").addEventListener("click", function() {
        music = music.filter(song => song.link != link);
        localStorage.setItem("savedMusic", JSON.stringify(music));
        songCard.remove();
    })
}    

let dark = true;
document.getElementById("theme").addEventListener("click", function() {
    if (dark) {
        document.body.style.backgroundColor = "#c9a5f8";
        document.querySelector(".nav-bar").style.backgroundColor = "rgb(198, 223, 247)";
        document.querySelector(".theme-img").src = "./images/night.png";
        dark = false;
    }
    else {
        document.body.style.backgroundColor = "#100123";
        document.querySelector(".nav-bar").style.backgroundColor = "rgb(106, 133, 160)";
        document.querySelector(".theme-img").src = "./images/day.png";
        dark = true;
    }
})


