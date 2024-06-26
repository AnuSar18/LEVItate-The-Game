const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

const birdImg = new Image();
birdImg.src = '/static/bird.png';  
const pipeImgTop = new Image();
pipeImgTop.src = '/static/pipe-top.png';  
const pipeImgBottom = new Image();
pipeImgBottom.src = '/static/pipe-bottom.png';  
const backgroundImg = new Image();
backgroundImg.src = '/static/background.png';  

const bird = {
    x: 50,
    y: 150,
    width: 84,
    height: 74,
    gravity: 0.2,
    lift: -4,
    velocity: 0
};

const pipes = [];
const pipeWidth = 80;
const pipeGap = 220;  
const horizontalPipeGap = 400;  
let frameCount = 0;
let score = 0;
const pipeSpeed = 1;
let gameStarted = false;

document.addEventListener("keydown", function(e) {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
        }
        bird.velocity = bird.lift;
    }
});

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImgTop, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(pipeImgBottom, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frameCount % 270 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width + horizontalPipeGap,
            top: pipeHeight,
            bottom: canvas.height - pipeHeight - pipeGap
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            bird.y < pipe.top
        ) {
            resetGame();
        }

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            bird.y + bird.height > canvas.height - pipe.bottom
        ) {
            resetGame();
        }

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    });
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameStarted = false;
}

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBird();
    
    if (gameStarted) {
        drawPipes();

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            resetGame();
        }

        updatePipes();
        frameCount++;
    } else {
        ctx.fillStyle = "#000";
        ctx.font = "30px Arial";
        ctx.fillText("Press SPACE to start", canvas.width / 2 - 150, canvas.height / 2);
    }

    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(draw);
}

draw();
