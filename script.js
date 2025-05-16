const horse = document.getElementById("horse");
const pole = document.getElementById("pole");

let score = 0;
const scoreBoard = document.createElement("div");
scoreBoard.style.position = "absolute";
scoreBoard.style.top = "10px";
scoreBoard.style.left = "10px";
scoreBoard.style.fontSize = "24px";
scoreBoard.style.fontWeight = "bold";
scoreBoard.innerText = "Score: 0";
document.body.appendChild(scoreBoard);

function jump() {
  if (!horse.classList.contains("jump")) {
    horse.classList.add("jump");
    setTimeout(() => horse.classList.remove("jump"), 500);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

let polePosition = -20;

function movePole() {
  polePosition += 5;
  pole.style.right = `${polePosition}px`;

  const poleLeft = window.innerWidth - polePosition;
  const horseBottom = parseInt(window.getComputedStyle(horse).getPropertyValue("bottom"));

  if (poleLeft < 100 && poleLeft > 50 && horseBottom < 10) {
    alert("Game Over! Final Score: " + score);
    location.reload();
  }

  if (polePosition > window.innerWidth + 20) {
    polePosition = -20; // Reset pole position
    score++;
    scoreBoard.innerText = "Score: " + score;
  }

  requestAnimationFrame(movePole);
}

movePole();