const screen = document.querySelector("#gameCanvas");
const paint = screen.getContext("2d");
const scoreText = document.querySelector("#score");
const livesText = document.querySelector("#lives");

const startButton = document.querySelector("#startbtn");
const pauseButton = document.querySelector("#pausebtn");
const restartButton = document.querySelector("#restartbtn");
const leftButton = document.querySelector("#leftbtn");
const rightButton = document.querySelector("#rightbtn");
const menuContainer = document.querySelector("#menu");
const gamescreen = document.querySelector("#game-screen");
const startmess = document.querySelector("#startMessage");

const game = {
    score: 0,
    lives: 3,
    level: 1,
    running: false,
    finished: false
};

const player = {
    x: 255,
    y: 650,
    w: 90,
    h: 10,
    move: 6
};

const ball = {
    x: 300,
    y: 645,
    size: 5,
    dx: 4,
    dy: -4,
    isStuck: true
};

const keyboard = {
    left: false,
    right: false
};

const flippers = {
    left: { cx: 0, cy: 350, length: 150, thickness: 20, angle: 0, dAngle: 0.05 },
    right: { cx: 630, cy: 350, length: 150, thickness: 20, angle: 0, dAngle: -0.05 }
};

let blocks = [];
startButton.addEventListener("click", function () {
    menuContainer.style.display = "none";
    openGame();
});

pauseButton.addEventListener("click", function () {
    game.running = false;
    menuContainer.style.display = "flex";
});

restartButton.addEventListener("click", function () {
    menuContainer.style.display = "none";
    openGame();
});

leftButton.addEventListener("mousedown", function () {
    keyboard.left = true;
});
leftButton.addEventListener("mouseup", function () {
    keyboard.left = false;
});
leftButton.addEventListener("mouseleave", function () {
    keyboard.left = false;
});

document.addEventListener("keydown", function (event) {
    if (event.code === "Enter" && ball.isStuck && game.running) {
        ball.isStuck = false;
        ball.dx = 0;
        ball.dy = -4;
    }
    if (event.key == "ArrowLeft") {
        keyboard.left = true;
    }
    if (event.key == "ArrowRight") {
        keyboard.right = true;
    }
});

screen.addEventListener("mousedown", function () {
    if (ball.isStuck && game.running) {
        ball.isStuck = false;
        ball.dx = 0;
        ball.dy = -4;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key == "ArrowLeft") {
        keyboard.left = false;
    }
    if (event.key == "ArrowRight") {
        keyboard.right = false;
    }
});

function makeBlocks() {
    blocks = [];
    /*if (game.level === 1) {
        for (let line = 0; line < 4; line++) {
            for (let place = 0; place < 8; place++) {
                blocks.push({
                    x: 37 + place * 68,
                    y: 60 + line * 30,
                    w: 50,
                    h: 16,
                    level: 1,
                    broken: false
                });
            }
        }
    }else*/  if (game.level === 2) {
        for (let line = 0; line < 5; line++) {
            for (let place = 0; place < 8; place++) {
                if ((line + place) % 2 === 0) {
                    blocks.push({
                        x: 37 + place * 68,
                        y: 60 + line * 30,
                        w: 50,
                        h: 16,
                        level: 2,
                        broken: false
                    });
                }
            }
        }
    } else if (game.level === 3) {
        for (let line = 0; line < 5; line++) {
            for (let place = 0; place < 8; place++) {
                if (place === line || place === 7 - line) {
                    blocks.push({
                        x: 37 + place * 68,
                        y: 60 + line * 30,
                        w: 50,
                        h: 16,
                        level: 3,
                        broken: false
                    });
                }
            }
        }
    } else if (game.level === 4) {
        for (let line = 0; line < 6; line++) {
            for (let place = 0; place < 8; place++) {
                if (place >= 3 - Math.floor(line / 2) && place <= 4 + Math.floor(line / 2)) {
                    blocks.push({
                        x: 37 + place * 68,
                        y: 60 + line * 30,
                        w: 50,
                        h: 16,
                        level: 5 - Math.floor(line / 2),
                        broken: false
                    });
                }
            }
        }
    }
    else if (game.level === 5) {
        for (let line = 0; line < 6; line++) {
            for (let place = 0; place < 8; place++) {

            }
        }
    }

    }

function drawBlocks() {
    blocks.forEach(function (block) {
        if (block.broken) return;

        if (block.level === 1) paint.fillStyle = "#ffffff";
        else if (block.level === 2) paint.fillStyle = "#ffff00" ;
        else if (block.level === 3) paint.fillStyle = "#ff0000";
        else if (block.level === 4) paint.fillStyle = "#00ff00";
        else if (block.level === 5) paint.fillStyle = "#808080";

        paint.fillRect(block.x, block.y, block.w, block.h);
    });
}

function drawPlayer() {
    paint.fillStyle = "#ffffff";
    paint.fillRect(player.x, player.y, player.w, player.h);
}

function drawBall() {
    paint.beginPath();
    paint.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    paint.fillStyle = "#ffffff";
    paint.fill();
    paint.closePath();
}

function drawFlippers() {
    if (game.level !== 2) return;
    paint.fillStyle = "#ffaa00";

    paint.save();
    paint.translate(flippers.left.cx, flippers.left.cy);
    paint.rotate(flippers.left.angle);
    paint.fillRect(-flippers.left.length/2, -flippers.left.thickness/2, flippers.left.length, flippers.left.thickness);
    paint.restore();

    paint.save();
    paint.translate(flippers.right.cx, flippers.right.cy);
    paint.rotate(flippers.right.angle);
    paint.fillRect(-flippers.right.length/2, -flippers.right.thickness/2, flippers.right.length, flippers.right.thickness);
    paint.restore();
}

function movePlayer() {
    if (keyboard.left) {
        player.x -= player.move;
    }
    if (keyboard.right) {
        player.x += player.move;
    }
    player.x = Math.max(0, Math.min(player.x, screen.width - player.w));

    if (ball.isStuck) {
        ball.x = player.x + player.w / 2;
        ball.y = player.y - ball.size - 1;
    }
}

function hitPlayer() {
    const touching =
        ball.y + ball.size >= player.y &&
        ball.y - ball.size <= player.y + player.h &&
        ball.x + ball.size >= player.x &&
        ball.x - ball.size <= player.x + player.w;

    if (touching && ball.dy > 0) {
        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dy = -ball.dy;
        const hitPoint = ball.x - (player.x + player.w / 2);
        ball.dx = hitPoint * 0.05;
        const newSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = (ball.dx / newSpeed) * currentSpeed;
        ball.dy = (ball.dy / newSpeed) * currentSpeed;
    }
}

function updateFlippers() {
    if (game.level !== 2) return;

    flippers.left.angle += 0.015;
    flippers.right.angle +=0.015;
}

function hitFlippers() {
    if (game.level !== 2) return;
    
    [flippers.left, flippers.right].forEach(flipper => {
        const dx = ball.x - flipper.cx;
        const dy = ball.y - flipper.cy;
        
        const localX = dx * Math.cos(-flipper.angle) - dy * Math.sin(-flipper.angle);
        const localY = dx * Math.sin(-flipper.angle) + dy * Math.cos(-flipper.angle);
        
        const halfW = flipper.length / 2;
        const halfH = flipper.thickness / 2;
        
        const touching = 
            localX + ball.size >= -halfW &&
            localX - ball.size <= halfW &&
            localY + ball.size >= -halfH &&
            localY - ball.size <= halfH;
            
        if (touching) {
            let localVx = ball.dx * Math.cos(-flipper.angle) - ball.dy * Math.sin(-flipper.angle);
            let localVy = ball.dx * Math.sin(-flipper.angle) + ball.dy * Math.cos(-flipper.angle);
            
            const overlapLeft = (localX + ball.size) - (-halfW);
            const overlapRight = halfW - (localX - ball.size);
            const overlapTop = (localY + ball.size) - (-halfH);
            const overlapBottom = halfH - (localY - ball.size);
            
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                if ((minOverlap === overlapTop && localVy > 0) || (minOverlap === overlapBottom && localVy < 0)) {
                    localVy = -localVy;
                    const tangentialV = localX * 0.02;
                    localVy += tangentialV * 0.6;
                }
            } else {
                if ((minOverlap === overlapLeft && localVx > 0) || (minOverlap === overlapRight && localVx < 0)) {
                    localVx = -localVx;
                }
            }
            
            ball.dx = localVx * Math.cos(flipper.angle) - localVy * Math.sin(flipper.angle);
            ball.dy = localVx * Math.sin(flipper.angle) + localVy * Math.cos(flipper.angle);
            
            const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            const maxSpeed = 7;
            const minSpeed = 3;
            if (currentSpeed > maxSpeed) {
                ball.dx = (ball.dx / currentSpeed) * maxSpeed;
                ball.dy = (ball.dy / currentSpeed) * maxSpeed;
            } else if (currentSpeed < minSpeed) {
                ball.dx = (ball.dx / currentSpeed) * minSpeed;
                ball.dy = (ball.dy / currentSpeed) * minSpeed;
            }
        }
    });
}

function hitWall() {
    if (ball.x - ball.size <= 0 || ball.x + ball.size >= screen.width) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.size <= 0) {
        ball.dy = -ball.dy;
    }
}

function ballOut() {
    if (ball.y - ball.size > screen.height) {
        game.lives--;
        livesText.textContent = game.lives;
        if (game.lives <= 0) {
            game.running = false;
            game.finished = true;
            menuContainer.style.display = "flex";
            alert("Bạn đã thua game!");
        } else {
            resetBall();
        }
    }
}

function resetBall() {
    ball.x = player.x + player.w / 2;
    ball.y = player.y - ball.size - 1;
    ball.dx = 0;
    ball.dy = -4;
    ball.isStuck = true;
}

function hitBlocks() {
    blocks.forEach(function (block) {
        if (block.broken) return;
        const touching =
            ball.x + ball.size >= block.x &&
            ball.y + ball.size >= block.y &&
            ball.x - ball.size <= block.x + block.w &&
            ball.y - ball.size <= block.y + block.h;
        if (touching) {
            if (touching) {
                const points = block.level * 5 ;
                game.score += points;
                scoreText.textContent = game.score;

                block.level--;
            }
            if (block.level <= 0) {
                block.broken = true;
            }

            const overlapLeft = (ball.x + ball.size) - block.x;
            const overlapRight = (block.x + block.w) - (ball.x - ball.size);
            const overlapTop = (ball.y + ball.size) - block.y;
            const overlapBottom = (block.y + block.h) - (ball.y - ball.size);

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                ball.dy = -ball.dy;
            } else {
                ball.dx = -ball.dx;
            }

        }
    });
}

function checkWinner() {
    const remain = blocks.some(function (block) {
        return !block.broken;
    });
    if (!remain) {
        if (game.level < 5) {
            game.level++;
            alert("Chúc mừng! Chuyển sang Level " + game.level);
            resetBall();
            makeBlocks();
        } else {
            game.running = false;
            game.finished = true;
            menuContainer.style.display = "flex";
            alert("Chúc mừng! Bạn đã phá đảo game!");
        }
    }
}

function update() {
    if (!game.running) return;
    movePlayer();
    updateFlippers();
    if (!ball.isStuck) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        hitWall();
        hitPlayer();
        hitBlocks();
        hitFlippers();
        ballOut();
    }
    checkWinner();
}

function screenClean() {
    paint.clearRect(0, 0, screen.width, screen.height);
}

function drawgame() {
    screenClean();
    drawBlocks();
    drawFlippers();
    drawBall();
    drawPlayer();
}

function gameLoop() {
    update();
    drawgame();
    requestAnimationFrame(gameLoop);
}
let waitingForEnter = false;
function openGame(){
    gamescreen.style.display = "flex";
    startmess.classList.remove("hidden");
    waitingForEnter = true;
}
document.addEventListener('keydown', (event) => {
    if(event.key === "Enter" && waitingForEnter) {
        startmess.classList.add("hidden");
        waitingForEnter = false;
        startGame();
    }
});
function startGame() {
    console.log("Game started!");
    game.score = 0;
    game.lives = 3;
    game.level = 1;
    game.running = true;
    game.finished = false;
    scoreText.textContent = game.score;
    livesText.textContent = game.lives;
    player.x = 255;
    resetBall();
    makeBlocks();
}

makeBlocks();
scoreText.textContent = game.score;
livesText.textContent = game.lives;
gameLoop();
