var backgroundMusic = document.getElementById('backgroundMusic');
var volumeIcon = document.getElementById('volumeIcon');
function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        volumeIcon.src = 'images/volume.png';
    } else {
        backgroundMusic.pause();
        volumeIcon.src = 'images/volume-off.png';
    }
}
document.addEventListener("keydown", (event) => {
    if (event.code === 'M') {
        toggleMusic();}});
var hoverSound = document.getElementById('hoverSound');
var menuButtons = document.querySelectorAll('.button_menu');
menuButtons.forEach(function(button) {
    button.addEventListener('mouseenter', playHoverSound);
});
function playHoverSound() {
    hoverSound.currentTime = 0; 
    hoverSound.play();
}
var buttonPressSound = document.getElementById('buttonPressSound');
var menuButtons = document.querySelectorAll('.button_menu');
menuButtons.forEach(function(button) {
    button.addEventListener('click', playButtonPressSound);
});
function playButtonPressSound() {
    buttonPressSound.currentTime = 0;
    buttonPressSound.play();
}



