function showOverlay() {
    document.getElementById("overlay").classList.add("visible");
}


function hideOverlay() {
    document.getElementById("overlay").classList.remove("visible");
}


function grab() {
    document.body.style.cursor = "grabbing";
}


function ungrab() {
    document.body.style.cursor = "";
}