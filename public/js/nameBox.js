var nameBox = document.getElementById("name-box");
const nameInput = document.getElementById("name-input");

//When user presses "enter"/"return" (with keycode 13) the modal name box is hidden on screen
nameInput.onkeypress = e => {
    let keycode = (e.keyCode ? e.keyCode : e.which);
    if(keycode == "13"){
        nameBox.style.display = "none";
    }
};
