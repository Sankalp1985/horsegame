const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.getElementById('gameOverText');
const restartBtn = document.getElementById('restartBtn');

// Prevent scrolling on mobile
document.body.style.overflow = 'hidden';

let width, height;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Load images
const horseImg = new Image();
horseImg.src = 'horse.png';  // Public example horse image

const poleImg = new Image();
poleImg.src = 'pole.png';     // Public example pole image

const bgImg = new Image();
bgImg.src = 'bcg.png';   // Public example background image

// Load sounds
const bgMusic = new Audio('horse-gallop.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.3;

const horseRunSound = new Audio('horse-gallop.mp3');
horseRunSound.loop = true;
horseRunSound.volume = 0.5;

const horseWhiningSound = new Audio('horse-whinny.mp3');
horseWhiningSound.volume = 0.8;

// Game Objects
let horse = {
  width: 120,
  height: 80,
  x: 100,
  y: 0,
  velocityY: 0,
  gravity: 1,
  isJumping: false,
  jumpStrength: -20
};

let pole = {
  width: 50,
  height: 100,
  x: 0,
  y: 0
};

let score = 0;
let gameOver = false;

// Track images loaded before starting game
let imagesLoaded = 0;
const totalImages = 3;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    resetGame();
  }
}

horseImg.onload = imageLoaded;
poleImg.onload = imageLoaded;
bgImg.onload = imageLoaded;

// Reset game state
function resetGame() {
  horse.y = height - horse.height - 10;
  horse.velocityY = 0;
  horse.isJumping = false;

  pole.x = width + 100;
  pole.y = height - pole.height - 10;

  score = 0;
  gameOver = false;
  scoreBoard.innerText = "Score: 0";
  gameOverScreen.style.display = "none";

  playSounds();
  requestAnimationFrame(gameLoop);
}

function playSounds() {
  bgMusic.play().catch(() => {});
  horseRunSound.play().catch(() => {});
}

function stopSounds() {
  bgMusic.pause(); bgMusic.currentTime = 0;
  horseRunSound.pause(); horseRunSound.currentTime = 0;
}

function playWhiningSound() {
  horseWhiningSound.play().catch(() => {});
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, width, height);
}

function drawHorse() {
  ctx.drawImage(horseImg, horse.x, horse.y, horse.width, horse.height);
}

function drawPole() {
  ctx.drawImage(poleImg, pole.x, pole.y, pole.width, pole.height);
}

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

function updatePole() {
  pole.x -= 8;

  if (pole.x + pole.width < 0) {
    pole.x = width + Math.random() * 200;
    score++;
    scoreBoard.innerText = "Score: " + score;
  }
}

function checkCollision() {
  const horseBottom = horse.y + horse.height;
  const poleTop = pole.y;
  const horizontalOverlap = horse.x < pole.x + pole.width && horse.x + horse.width > pole.x;

  if (horizontalOverlap && horseBottom > poleTop) {
    gameOver = true;
    stopSounds();
    playWhiningSound();
  }
}

function gameLoop() {
  if (gameOver) {
    gameOverText.textContent = `Game Over! Final Score: ${score}`;
    gameOverScreen.style.display = "block";
    return;
  }

  ctx.clearRect(0, 0, width, height);
  drawBackground();
  drawHorse();
  drawPole();
  updateHorse();
  updatePole();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

// Controls
window.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.key === " ") && !horse.isJumping && !gameOver) {
    horse.isJumping = true;
    horse.velocityY = horse.jumpStrength;
  }
  playSounds();
});
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (!horse.isJumping && !gameOver) {
    horse.isJumping = true;
    horse.velocityY = horse.jumpStrength;
  }
  playSounds();
});

// Restart button
restartBtn.addEventListener("click", () => {
  resetGame();
});
