const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let score = document.getElementById("score");
const playerSprite = "https://s1.piq.land/2012/08/03/paZnmbRnkMj8cyBcesOXhvdl_400x400.png";

let gameScore = score.innerHTML;

function startGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    score.innerHTML = 0;
    enemies.length = 3;
    gameScore = 0;
    enemies = [
      new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.02),
      new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.01),
      new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.002),
    ];
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);

  }
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function increaseScore() {

  gameScore++;
  score.innerHTML = gameScore;
  score = document.getElementById("score");
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}
function addEnemy(){
if(gameScore%100===0){
  enemies.push(new Enemy(random(800),random(600),getRandomArbitrary(5,15),getRandomColor(),randomDec(.06)));
}
function random(range){
  return Math.floor(Math.random()*range);
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function randomDec(range){
  return (Math.random()*range);
}
}
class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  checkBoundary() {
  if (this.x < 0) {
    this.x = 0;
  }
  if (this.x + this.radius > canvas.width) {
    this.x = canvas.width - this.radius;
  }
  if (this.y < 0) {
    this.y = 0;
  }
  if (this.y + this.radius > canvas.height) {
    this.y = canvas.height - this.radius;
  }
}
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();

    this.image = new Image();
    this.image.src = playerSprite;
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 25, 30);
  }
}

let player = new Player(250, 150, 10, "black", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();

    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.02),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.01),
  new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.002),
  new Enemy(0, 200, 10, "rgba(250, 210, 70, 0.6)", 0.008),
  new Enemy(400, 400, 15, "rgba(0, 200, 250, 0.6)", 0.008),
];
let scarecrow;

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = c1.radius + c2.radius - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  player.checkBoundary();
  increaseScore();
  enemies.forEach(enemy => moveToward(scarecrow || player, enemy, enemy.speed));
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i+1; j < enemies.length; j++) {
      pushOff(enemies[i], enemies[j]);
    }
  }
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 2;
    }
  });
   if (scarecrow) {
    scarecrow.draw();
    scarecrow.ttl--;
    if (scarecrow.ttl < 0) {
      scarecrow = undefined;
    }
  }
}

function clearBackground() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  clearBackground();
  player.draw();
  addEnemy();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  if (progressBar.value <= 0) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`You got spherically terminated`, (canvas.width/4)-35, canvas.height / 2);
        ctx.fillText(`Click to revive`, (canvas.width/3)+25, (canvas.height / 2)-30);
  } else {
    requestAnimationFrame(drawScene);
  }
}

canvas.addEventListener("dblclick", () => {
    if (!scarecrow) {
      scarecrow = new Player(player.x, player.y, 10, "lemonchiffon", 0.05);
      scarecrow.ttl = 300;
    }
});

canvas.addEventListener("click", startGame);
requestAnimationFrame(drawScene);
