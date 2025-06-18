function showOverlay() {
    document.getElementById("overlay").classList.add("active");
}


function hideOverlay() {
    document.getElementById("overlay").classList.remove("active");
}


function grab() {
    document.body.style.cursor = "grabbing";
}


function ungrab() {
    document.body.style.cursor = "";
}