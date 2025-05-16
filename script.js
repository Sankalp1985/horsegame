const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.getElementById('gameOverText');
const restartBtn = document.getElementById('restartBtn');

let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Load sounds
const bgMusic = new Audio('https://cdn.pixabay.com/download/audio/2021/12/19/audio_2c405abffb.mp3?filename=happy-background-music-2689.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const horseRunSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_325d9d1bcf.mp3?filename=horse-hoof-beats-14211.mp3');
horseRunSound.loop = true;
horseRunSound.volume = 0.5;

const horseWhiningSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/23/audio_3b4289b65a.mp3?filename=horse-whinny-39410.mp3');
horseWhiningSound.volume = 0.8;

// Game variables
let horse = {
  width: 80,
  height: 60,
  x: 100,
  y: height - 60 - 10, // 10 px from bottom
  velocityY: 0,
  gravity: 1,
  isJumping: false,
  jumpStrength: -20
};

let pole = {
  width: 30,
  height: 150,
  x: width,
  y: height - 150 - 10
};

let score = 0;
let gameOver = false;

function resetGame() {
  horse.y = height - horse.height - 10;
  horse.velocityY = 0;
  horse.isJumping = false;
  
  pole.x = width;
  
  score = 0;
  gameOver = false;
  scoreBoard.textContent = 'Score: 0';
  gameOverScreen.style.display = 'none';

  // Start background music and horse run sound
  playSounds();

  requestAnimationFrame(gameLoop);
}

function playSounds() {
  // Play background music and running sound
  bgMusic.play().catch(() => {});
  horseRunSound.play().catch(() => {});
}

function stopSounds() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  horseRunSound.pause();
  horseRunSound.currentTime = 0;
}

function playWhiningSound() {
  horseWhiningSound.play().catch(() => {});
}

// Draw horse (brown rectangle)
function drawHorse() {
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(horse.x, horse.y, horse.width, horse.height);
}

// Draw pole (green rectangle)
function drawPole() {
  ctx.fillStyle = 'green';
  ctx.fillRect(pole.x, pole.y, pole.width, pole.height);
}

// Update horse position and physics
function updateHorse() {
  if (horse.isJumping) {
    horse.velocityY += horse.gravity;
    horse.y += horse.velocityY;

    if (horse.y > height - horse.height - 10) {
      horse.y = height - horse.height - 10;
      horse.velocityY = 0;
      horse.isJumping = false;
    }
  }
}

// Update pole position
function updatePole() {
  pole.x -= 8;

  if (pole.x + pole.width < 0) {
    pole.x = width + Math.random() * 200;
    score++;
    scoreBoard.textContent = 'Score: ' + score;
  }
}

// Check collision
function checkCollision() {
  let horseBottom = horse.y + horse.height;
  let poleTop = pole.y;
  let horizontalOverlap = horse.x < pole.x + pole.width && horse.x + horse.width > pole.x;

  if (horizontalOverlap && horseBottom > poleTop) {
    gameOver = true;

    // Stop bg & run sounds
    stopSounds();

    // Play whining sound once
    playWhiningSound();
  }
}

// Clear canvas
function clear() {
  ctx.clearRect(0, 0, width, height);
}

// Main game loop
function gameLoop() {
  if (gameOver) {
    gameOverText.textContent = `Game Over! Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
    return;
  }

  clear();
  drawHorse();
  drawPole();
  updateHorse();
  updatePole();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

// Controls: jump on space or tap
window.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.key === ' ') && !horse.isJumping && !gameOver) {
    horse.isJumping = true;
    horse.velocityY = horse.jumpStrength;
  }
});
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (!horse.isJumping && !gameOver) {
    horse.isJumping = true;
    horse.velocityY = horse.jumpStrength;
  }
});

// Restart button
restartBtn.addEventListener('click', () => {
  resetGame();
});

// Start game first time
resetGame();
