let storage = localStorage.getItem("playMusic");
let music = JSON.parse(storage);
let linkArr = music.link.split("/");
let songCode = linkArr[linkArr.length - 1];
let songCard = document.getElementById("embedded-song");
songCard.innerHTML = `<iframe
                            class="frame"
                            height="360"
                            style="border: none;"
                            width="90%"
                            src="https://open.spotify.com/embed/track/${songCode}?utm_source=generator"
                            allowFullScreen
                            allow="autoplay; gyroscope; accelerometer; encrypted-media; fullscreen; picture-in-picture">
                      </iframe>`

// -----------------------------------------------------------

let nav_bar = document.querySelector(".nav-bar")
let img = document.querySelector(".theme-img")
let darkTheme = JSON.parse(localStorage.getItem("theme"));
if (!darkTheme) {
    document.body.style.backgroundColor = "#c9a5f8";
    nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
    img.src = "./images/night.png";
}
document.getElementById("theme").addEventListener("click", function() {
    if (darkTheme) {
        document.body.style.backgroundColor = "#c9a5f8";
        nav_bar.style.backgroundColor = "rgb(198, 223, 247)";
        img.src = "./images/night.png";
        darkTheme = false;
    }
    else {
        img.src = "./images/day.png";
        document.body.style.backgroundColor = "#100123";
        nav_bar.style.backgroundColor = "rgb(106, 133, 160)";
        darkTheme = true;
    }
    localStorage.setItem("theme", JSON.stringify(darkTheme));
})                      

// -----------------------------------------------------------

document.getElementById("back").addEventListener("click", function() {
    let last_link = localStorage.getItem("last_page");
    window.location.href = `${last_link}`;
})