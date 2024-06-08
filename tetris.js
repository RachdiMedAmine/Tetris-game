const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
let scoreElement = document.getElementById("score");
const levels=document.getElementById("level");
const gameoveroverlay = document.getElementById("game-over-overlay");



const ROW = 22;
const COL = COLUMN = 10;
const SQ = squareSize = 30;
const VACANT = "WHITE";

let isKeyDown = {};
let moveLeftFlag = false;
let moveRightFlag = false;
let moveDownFlag = false;
let rotateFlag = false;
let gameOver = false;
let score = 0;
let reducedscore = false;

function playMoveSound() {
    var moveSound = document.getElementById('moveSound');
    moveSound.volume = 0.15;
    moveSound.currentTime = 0;
    moveSound.play().catch(error => {
        // Handle the error if the browser doesn't allow autoplay
        console.error('Failed to play move sound:', error);
    });
}



function quit(){
    const leave = confirm('If you guit the game will be over , Are you sure you still want to quit ?');
    if (leave) {
        window.location.href='menu.html';
        
    }

}
function playRowFilledSoundFunction() {
    var rowFilledSound = document.getElementById('rowFilledSound');
    rowFilledSound.volume = 0.5; // Adjust the volume as needed
    rowFilledSound.currentTime = 0;
    rowFilledSound.play().catch(error => {
        console.error('Failed to play row filled sound:', error);
    });
}

function fadeIn(element) {
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

    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    
        ctx.strokeStyle = "BLACK";
        ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
    }
    function restartGame() {
        score = 0;
        scoreElement.innerHTML = "Score: " + 0;
        gameOver = false;
        reducedscore = false;
        board = Array.from({ length: ROW }, () => Array(COL).fill(VACANT));
        fadeOut(gameoveroverlay);
        drawBoard();
        p = randomPiece();
        backgroundMusic.play();
        drop();
    }
    let board = [];
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
    
    // draw the board
    function drawBoard() {
        for (r = 0; r < ROW; r++) {
            for (c = 0; c < COL; c++) {
                drawSquare(c, r, board[r][c]);
            }
        }
    }
    
    drawBoard();
    const PIECES = [
        [Z, "red"],
        [P, "green"],
        [T, "#0091aa"],
    ];
    // generate random pieces
    function randomPiece() {
        let r = randomN = Math.floor(Math.random() * PIECES.length);
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }
    
    let p = randomPiece();
    function Piece(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
    
        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.x = 3;
        this.y = -2;
    }
    
    
    Piece.prototype.fill = function (color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }
    

    Piece.prototype.draw = function () {
        this.fill(this.color);
    }
 
    Piece.prototype.unDraw = function () {
        this.fill(VACANT);
    }

    Piece.prototype.moveDown = function () {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            p = randomPiece();
        }
    }
    Piece.prototype.moveRight = function () {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    Piece.prototype.moveLeft = function () {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    Piece.prototype.rotate = function () {
        if (!this.collision(0, 0, this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]) && !isPaused) {
            this.unDraw();
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

    
    Piece.prototype.lock = function () {
    let count = 0; 
    let playRowFilledSound = true; 

    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }

            if (this.y + r < 0) {
                gameOver = true;
                fadeIn(gameoveroverlay);
                document.getElementById("game-over-overlay").style.display = 'block'
                var GameOverMusic = document.getElementById('gameover-sound');
                GameOverMusic.volume = 1;
                var backgroundMusic = document.getElementById('backgroundMusic');
                backgroundMusic.pause();
                GameOverMusic.play();
                document.getElementById('restartBtn').addEventListener('click', restartGame);
                break;
            }
            if (this.y + r <= 17) {
                if (reducedscore == false){
                    console.log(this.y + r);
                    score-=100;
                    reducedscore = true;
                    
                }
                
            }

            board[this.y + r][this.x + c] = this.color;
        }
    }

    for (let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] !== VACANT);
        }
        if (isRowFull) {
            count++;

            if (playRowFilledSound) {
                playRowFilledSound = false;
                playRowFilledSoundFunction(); 
            }

            for (let y = r; y > 0; y--) {
                for (let c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }

            for (let c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
        }
    }

    drawBoard();
    if (count === 1) {
        score += 40;
    } else if (count === 2) {
        score += 100;
    } else if (count === 3) {
        score += 300;
    } else if (count === 4) {
        score += 1200;
    }
    scoreElement.innerHTML = "Score: " + score;
};


    Piece.prototype.collision = function (x, y, piece) {
        for (r = 0; r < piece.length; r++) {
            for (c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                if (newY < 0) {
                    continue;
                }
                if (board[newY][newX] !== VACANT) {
                    return true;
                }
            }
        }
        return false;
    }
    
    let isPaused = false;

    
    function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            document.getElementById('pauseBtn').textContent = 'Resume';
        } else {
            document.getElementById('pauseBtn').textContent = 'Pause';
            drop();
        }
    }
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.addEventListener("keydown", (event) => {
        if (event.code === 'Escape') {
            togglePause();
            event.preventDefault();
        } else {
            isKeyDown[event.code] = true;
            handleKeyPress();
        }
    });


    document.addEventListener("keyup", (event) => {
        isKeyDown[event.code] = false;
        if (event.code === 'ArrowLeft') {
            moveLeftFlag = false;
        } else if (event.code === 'ArrowRight') {
            moveRightFlag = false;
        } else if (event.code === 'ArrowDown') {
            moveDownFlag = false;
        } else if (event.code === 'Space') {
            rotateFlag = false;
        }
    });
    
    function handleKeyPress() {
        if (isKeyDown['ArrowLeft'] && !moveLeftFlag && !isPaused) {
            moveLeftFlag = true;
            moveLeft();
        }
        if (isKeyDown['ArrowRight'] && !moveRightFlag && !isPaused) {
            moveRightFlag = true;
            moveRight();
        }
        if (isKeyDown['ArrowDown'] && !moveDownFlag && !isPaused) {
            moveDownFlag = true;
            moveDown();
        }
        if (isKeyDown['Space'] && !rotateFlag) {
            rotateFlag = true;
            p.rotate();
            dropStart = Date.now();
            playMoveSound();
        }
    }
    
    function moveLeft() {
        if (!p.collision(-1, 0, p.activeTetromino)) {
            p.unDraw();
            p.x--;
            p.draw();
            setTimeout(() => {
                if (moveLeftFlag) {
                    moveLeft();
                }
            }, 100);
            playMoveSound();
        }
    }
    
    function moveRight() {
        if (!p.collision(1, 0, p.activeTetromino)) {
            p.unDraw();
            p.x++;
            p.draw();
            setTimeout(() => {
                if (moveRightFlag) {
                    moveRight();
                }
            }, 100);
            playMoveSound();
        }
    }
    
    function moveDown() {
        const moveDelay = moveDownFlag ? 50 : 800;  
    
        if (!p.collision(0, 1, p.activeTetromino)) {
            p.unDraw();
            p.y++;
            p.draw();
            
            setTimeout(() => {
                if (moveDownFlag) {
                    moveDown();
                    playMoveSound();

                }
            }, moveDelay);
        } else {
             
            p.lock();
            p = randomPiece();
            
        }

    }

    
    
    
    function setGradientBackground(color1, color2, color3) {
        const gradient = `linear-gradient(45deg, ${color1}, ${color2}, ${color3})`;
        document.body.style.background = gradient;
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientBackground 10s ease infinite';
    }
 
    let dropStart = Date.now();

    
    function drop() {
        if (isPaused || gameOver) {
            return;
            
        }
        let now = Date.now();
        let delta = now - dropStart;
        if (score <= 120) {
            levels.innerHTML ="Level: 1";  
            setGradientBackground("#6562ff", "#a6dcef", "#f4acb7");
            if (delta > 800) {
                p.moveDown();
                dropStart = Date.now();
            }
        }
    
        if (score > 120 && score <= 240) {
            setGradientBackground("#7876ff", "#84deff", "#7b29ff");
            levels.innerHTML ="Level: 2";
            if (delta > 600) {
                p.moveDown();
                dropStart = Date.now();
            }
        }
        
        if (score > 240 && score <= 480) {
            setGradientBackground("#2d2aff", "#24c5ff", "#6404ff");
            levels.innerHTML ="Level: 3";
            if (delta > 400) {
                p.moveDown();
                dropStart = Date.now();
            }
        }
        
        if (score > 480 && score <= 960) {
            setGradientBackground("#3e0077", "#3baffc", "#ff0426");
            levels.innerHTML ="Level: 4";
            if (delta > 200) {
                p.moveDown();
                dropStart = Date.now();
                
            }
        }
        
        if (score > 960) { 
            setGradientBackground("#3b0072", "#3baffc", "#a50000");
            levels.innerHTML ="Level: 5";
            if (delta > 50) {
                p.moveDown();
                dropStart = Date.now();
                
            }
        }
        
    
        if (!gameOver && !isPaused) {
            requestAnimationFrame(drop);
        }
    }
 
    drop();