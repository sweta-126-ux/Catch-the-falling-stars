<CodeBlock language="javascript" editable>
const arena = document.getElementById("arena");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const status = document.getElementById("status");
const startButton = document.getElementById("start");

let score = 0;
let best = 0;
let playerX = 50;
let stars = [];
let running = false;
let animationId;
let lastTime = 0;
let spawnTime = 0;
let elapsed = 0;
try {
best = Number(localStorage.getItem("fallingStarsBest")) || 0;
} catch {}
bestDisplay.textContent = best;
function movePlayer(direction) {
if (!running) return;
const width = player.offsetWidth;
const arenaWidth = arena.clientWidth;
const current = (playerX / 100) * arenaWidth;
playerX = Math.max(
(width / 2 / arenaWidth) * 100,
Math.min(100 - (width / 2 / arenaWidth) * 100,
playerX + direction * 4)
);
player.style.left = $DIL0%;
}
const keys = new Set();
document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) {
    event.preventDefault();
  }
  keys.add(key);
if (key === " " && !running) startGame();
});
document.addEventListener("keyup", event => {
  keys.delete(event.key.toLowerCase());
});
window.addEventListener("blur", () => keys.clear());
function spawnStar() {
  const star = document.createElement("div");
  star.className = "star";
  star.textContent = "⭐";
const x = Math.random() * (arena.clientWidth - 30);
star.style.left = $DIL0px;
arena.appendChild(star);
stars.push({ element: star, x, y: -30 });
}
function endGame() {
running = false;
cancelAnimationFrame(animationId);
startButton.textContent = "Play Again";
status.textContent = Game over! Your score: $DIL0;
}
function startGame() {
  cancelAnimationFrame(animationId);
  stars.forEach(star => star.element.remove());
  stars = [];
score = 0;
  playerX = 50;
  elapsed = 0;
  spawnTime = 0;
  lastTime = 0;
  running = true;
scoreDisplay.textContent = score;
  player.style.left = "50%";
  startButton.textContent = "Restart Game";
  status.textContent = "Catch as many stars as you can!";
animationId = requestAnimationFrame(update);
}
function update(time) {
  if (!running) return;
const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
  lastTime = time;
  elapsed += delta;
  spawnTime += delta;
if (keys.has("arrowleft") || keys.has("a")) movePlayer(-delta);
  if (keys.has("arrowright") || keys.has("d")) movePlayer(delta);
if (spawnTime >= 32) {
    spawnStar();
    spawnTime = 0;
  }
  const playerRect = player.getBoundingClientRect();
for (let i = stars.length - 1; i >= 0; i--) {
const star = stars[i];
star.y += (3 + score * 0.025) * delta;
star.element.style.top = $DIL0px;
    const starRect = star.element.getBoundingClientRect();
const caught =
      starRect.bottom >= playerRect.top &&
      starRect.top <= playerRect.bottom &&
      starRect.right >= playerRect.left &&
      starRect.left <= playerRect.right;
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
    } else if (star.y > arena.clientHeight) {
      star.element.remove();
      stars.splice(i, 1);
      endGame();
      return;
    }
  }
animationId = requestAnimationFrame(update);
}
startButton.addEventListener("click", startGame);
</CodeBlock>
