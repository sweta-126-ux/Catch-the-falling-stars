
const startButton = document.getElementById("start");
const status = document.getElementById("status");
const player = document.getElementById("player");
const arena = document.getElementById("arena");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");

let score = 0;
let best = 0;
let running = false;
let playerX = 50;
let stars = [];
let animationId;
let lastTime = 0;
let spawnTimer = 0;
let misses = 0;

try {
  best = Number(localStorage.getItem("fallingStarsBest")) || 0;
} catch {}

bestDisplay.textContent = best;

function startGame() {
  cancelAnimationFrame(animationId);

  stars.forEach(star => star.element.remove());
  stars = [];

  score = 0;
  misses = 0;
  playerX = 50;
  spawnTimer = 0;
  lastTime = 0;
  running = true;

  scoreDisplay.textContent = "0";
  player.style.left = "50%";
  startButton.textContent = "Restart Game";
  status.textContent = "Catch the stars! You have 3 misses.";

  animationId = requestAnimationFrame(update);
}

function spawnStar() {
  const element = document.createElement("div");
  element.className = "star";
  element.textContent = "⭐";

  const x = Math.random() * Math.max(0, arena.clientWidth - 30);
  element.style.left = `${x}px`;
  arena.appendChild(element);

  stars.push({ element, x, y: -30 });
}

function update(time) {
  if (!running) return;

  const delta = lastTime
    ? Math.min((time - lastTime) / 16.67, 2)
    : 1;

  lastTime = time;
  spawnTimer += delta;

  if (keys.has("arrowleft") || keys.has("a")) {
    playerX -= 0.35 * delta;
  }

  if (keys.has("arrowright") || keys.has("d")) {
    playerX += 0.35 * delta;
  }

  const halfWidth = (player.offsetWidth / 2 / arena.clientWidth) * 100;
  playerX = Math.max(halfWidth, Math.min(100 - halfWidth, playerX));
  player.style.left = `${playerX}%`;

  if (spawnTimer >= 35) {
    spawnStar();
    spawnTimer = 0;
  }

  const playerRect = player.getBoundingClientRect();
  const arenaRect = arena.getBoundingClientRect();

  for (let i = stars.length - 1; i >= 0; i--) {
    const star = stars[i];
    star.y += (3 + score * 0.025) * delta;
    star.element.style.top = `${star.y}px`;

    const rect = star.element.getBoundingClientRect();

    const caught =
      rect.bottom >= playerRect.top &&
      rect.top <= playerRect.bottom &&
      rect.right >= playerRect.left &&
      rect.left <= playerRect.right;

    if (caught) {
      score++;
      scoreDisplay.textContent = score;

      if (score > best) {
        best = score;
        bestDisplay.textContent = best;

        try {
          localStorage.setItem("fallingStarsBest", best);
        } catch {}
      }

      star.element.remove();
      stars.splice(i, 1);
    } else if (rect.top > arenaRect.bottom) {
      star.element.remove();
      stars.splice(i, 1);
      misses++;

      if (misses >= 3) {
        running = false;
        cancelAnimationFrame(animationId);
        startButton.textContent = "Play Again";
        status.textContent = `Game over! Final score: ${score}`;
        return;
      }

      status.textContent = `Misses: ${misses}/3`;
    }
  }

  animationId = requestAnimationFrame(update);
}

const keys = new Set();

document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();

  if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
    event.preventDefault();
  }

  keys.add(key);

  if (key === " " && !running) {
    event.preventDefault();
    startGame();
  }
});

document.addEventListener("keyup", event => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("blur", () => keys.clear());

startButton.addEventListener("click", startGame);
