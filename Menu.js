const Menu = document.getElementById('menu')
const instruction = document.getElementById('instructions');
const story_tetris = document.getElementById('history');


function fadeIn(element) {0
    element.style.opacity = 0;
    element.style.display = 'flex';

    let opacity = 0;
    const intervalId = setInterval(function () {
        if (opacity < 1) {
            opacity += 0.1;
            element.style.opacity = opacity;
        } else {
            clearInterval(intervalId);
        }
    }, 10);
}
function fadeOut(element) {
    let opacity = 1;
    const intervalId = setInterval(function () {
        if (opacity > 0) {
            opacity -= 0.1;
            element.style.opacity = opacity;
        } else {
            element.style.display = 'none';
            clearInterval(intervalId);
        }
    }, 10);
}
function instructions() {
    fadeOut(Menu);
    fadeIn(instruction);

}
function back_to_menu(){
    fadeOut(instruction);
    fadeOut(story_tetris);
    fadeIn(Menu);

}
function historytetris() {
    fadeOut(Menu);
    fadeIn(story_tetris);
}