const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let score;
let gameInterval;

function randomTile() {
    return Math.floor(Math.random() * tileCount);
}

function generateFood() {
    food = {
        x: randomTile(),
        y: randomTile()
    };
    // Make sure food is not on the snake
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = randomTile();
        food.y = randomTile();
    }
}

function drawGame() {
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Final Score: ' + score);
    } else {
        drawGame();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1; // start moving right automatically
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    generateFood();
    drawGame();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (e.key === 'ArrowRight' && dx === 0) {
        dx = 1;
        dy = 0;
    } else if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1;
    }
});

// Restart button handler
document.getElementById('restartBtn').addEventListener('click', () => {
    resetGame();
});

// Start game initially
resetGame();
