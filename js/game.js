var cursors;
var player;
var monster;
var gstone = "";
var groupmonster;
var map, layer;
var txtscore;
var numscore = 0;
var txtlevel;
var numlevel = 0;
var x, y;
var explosionParticle;
var stone;
var timer;
var timerContador;
var timerInterval;
var numMonsters;
var partida = null;

var options = {
  width: 510,
  height: 480,
  speedHero: 200,
  speedEnemy: 150
};

var gobins = new Phaser.Game(
  options.width,
  options.height,
  Phaser.CANVAS,
  "gobins",
  {
    preload: preload,
    create: create,
    update: update
    //render: render
  }
);

function preload() {
  //cargar los sprites
  gobins.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  gobins.scale.pageAlignHorizontally = true;
  gobins.scale.pageAlignVertidally = true;

  gobins.load.image("fondo", "images/background.png");
  gobins.load.image("hero", "images/hero.png");
  gobins.load.image("monster", "images/monster.png");
  gobins.load.image("stone", "images/deadmonster.png");
  gobins.load.spritesheet("explosion", "images/explosion.png", 127, 120);
}

function create() {
  //cargar el nivel desde el index y cargar el usuario desde el index
  partida = JSON.parse(localStorage.getItem("player"));

  // depende del nivel, elegir monstruos
  numlevel = parseInt(partida.dificultad);
  if (partida.dificultad == "1") {
    numMonsters = 5;
  } else if (partida.dificultad == "2") {
    numMonsters = 10;
  } else {
    numMonsters = 15;
  }

  //Agregar el fondo
  gobins.add.sprite(0, 0, "fondo");
  character();

  score();
  level();

  cursors = gobins.input.keyboard.createCursorKeys();
  // gobins.add.sprite(monster.position.x, monster.position.y, 'explotion');
  gstone = gobins.add.group();
  gstone.enableBody = true;
  gstone.physicsBodyType = Phaser.Physics.ARCADE;
  gobins.physics.arcade.enable(gstone);

  groupmonster = gobins.add.group();
  groupmonster.enableBody = true;
  groupmonster.physicsBodyType = Phaser.Physics.ARCADE;

  gobins.physics.arcade.enable(groupmonster);
  createEnemy();
  gobins.paused = false;
  setTimer();
  timerContador = 0;
  timerInterval = setInterval(() => {
    timerContador++;
  }, 1000);
}

function setTimer() {
  timer = gobins.add.text(350, 440, "TIME:" + timerContador, {
    fontSize: "30px",
    fill: "#fff",
    align: "center"
  });
  timer.font = "Arial Black";
  timer.stroke = "#222";
  timer.strokeThickness = 6;
}


function update() {
  timer.setText("TIME: " + timerContador);

  if (gobins.paused) {
    // // Calculate the corners of the menu
    // gobins.input.keyboard.onPressCallback = function(e) {
    //   console.log("key pressed", e);
    // };
  } else {
    gobins.input.keyboard.onPressCallback = function (e) {
      console.log("key pressed", e);
      if (e == "e") {
        var users = JSON.parse(localStorage.getItem("users"));
        users.forEach(element => {
          if (element.id == partida.id) {
            element.score = timerContador * numlevel * numMonsters;
          }
        });

        localStorage.setItem("users", JSON.stringify(users));

        window.location.href = "index.html";
      }
      if (e == "r") {       
        create();
      }
    };
   
    gobins.paused = false;
  }
  
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  
  gobins.physics.arcade.collide(
    player,
    gstone,
    function (player, gstone) { },
    null,
    this
  );

  var en = groupmonster.children;

  en.forEach(element => {
    gobins.physics.arcade.collide(player, element, function (player, element) {
      if (element.kill()) {
        createExplotion(element.position.x, element.position.y);       
        numscore += 10;
        txtscore.text = "SCORE: " + numscore;
      }
    }),
      null,
      this;
  });

  if (cursors.left.isDown) {
    player.body.velocity.x = -options.speedHero;
  }
  if (cursors.right.isDown) {
    player.body.velocity.x = options.speedHero;
  }
  if (cursors.up.isDown) {
    player.body.velocity.y = -options.speedHero;
  }
  if (cursors.down.isDown) {
    player.body.velocity.y = options.speedHero;
  }

  groupmonster.children.forEach(monster => {
    if (
      monster.body.blocked.right == true ||
      monster.body.blocked.left == true ||
      monster.body.blocked.up == true ||
      monster.body.blocked.down == true
    ) {

      if (monster.body.blocked.right) {
        var rd = Math.floor(Math.random() * 3);

        if (rd == 0) {
          monster.body.velocity.x = -100;
          monster.body.velocity.y = -100;
        } else if (rd == 1) {
          monster.body.velocity.x = -100;
          monster.body.velocity.y = 100;
        } else {
          monster.body.velocity.x = -200;
          monster.body.velocity.y = 0;
        }
      }

      if (monster.body.blocked.left) {
        var rd = Math.floor(Math.random() * 3);

        if (rd == 0) {         
          monster.body.velocity.y = 100;
          monster.body.velocity.x = 100;
        } else if (rd == 1) {         
          monster.body.velocity.x = 100;
          monster.body.velocity.y = -100;
        } else {          
          monster.body.velocity.x = 200;
          monster.body.velocity.y = 0;
        }
      }

      if (monster.body.blocked.up) {
        var rd = Math.floor(Math.random() * 3);

        if (rd == 0) {          
          monster.body.velocity.x = -100;
          monster.body.velocity.y = 100;
        } else if (rd == 1) {         
          monster.body.velocity.x = 100;
          monster.body.velocity.y = 100;
        } else {         
          monster.body.velocity.x = 0;
          monster.body.velocity.y = 200;
        }
      }

      if (monster.body.blocked.down) {
        var rd = Math.floor(Math.random() * 3);

        if (rd == 0) {        
          monster.body.velocity.x = -100;
          monster.body.velocity.y = -100;
        } else if (rd == 1) {         
          monster.body.velocity.x = 100;
          monster.body.velocity.y = -100;
        } else {          
          monster.body.velocity.x = 0;
          monster.body.velocity.y = -200;
        }
      }
    }
  });

  var a = groupmonster.children.length;
  var contador = 0;
  groupmonster.children.forEach(element => {
    element.alive == true ? contador++ : null;
  });
  
  if (contador == 0) {
    win();
  }
}

function win() {
  var w = options.width,
    h = options.height;
  numscore = 0;
  clearInterval(timerInterval);
  
  gobins.paused = true;

  gobins.add.text(120, 80, "YOU WON", {
    font: "50px Arial",
    fill: "white"
  });
  gobins.add.text(60, 260, "Press (e) to exit the game", {
    font: "30px Arial",
    fill: "white"
  });
  gobins.add.text(60, 300, "Press (r) to restart the game", {
    font: "30px Arial",
    fill: "white"
  });
}

function character() {
  player = gobins.add.sprite(gobins.width / 2, gobins.height / 2, "hero");
  gobins.physics.arcade.enable(player);
  gobins.physics.enable(player);
  player.body.collideWorldBounds = true;
  player.body.bounce = 1;
}

function createEnemy() {
  var rdx = Math.floor(Math.random() * options.width - 30);
  var rdy = Math.floor(Math.random() * options.height - 30);
  if (rdx > 490 || rdy > 390 || rdx < 10 || rdy < 10) {
    createEnemy();
  } else {
    for (let i = 0; i < numMonsters; i++) {
      var rdX = aleatorio();
      var rdY = aleatorio();

      var vel = 100;

      var m = groupmonster.create(rdX, rdY, "monster");

      var rd = Math.floor(Math.random() * 3);
      if (rd == 0) {
        m.body.velocity.x = -vel;
        m.body.velocity.y = vel;
      } else if (rd == 1) {
        m.body.velocity.x = vel;
        m.body.velocity.y = -vel;
      } else if (rd == 2) {
        m.body.velocity.x = -vel;
        m.body.velocity.y = -vel;
      } else if (rd == 3) {
        m.body.velocity.x = vel;
        m.body.velocity.y = vel;
      }

      m.body.collideWorldBounds = true;
    }
  }
}

function createDead(x, y) {
  var stone = gstone.create(x, y, "stone");

  gobins.physics.arcade.enable(stone);
  stone.body.immovable = true;
  stone.anchor.set(0.6);
}

function createExplotion(x, y) {
  createDead(x, y);
  sprite = gobins.add.sprite(x - 60, y - 50, "explosion");
  sprite.animations.add("walk");
  sprite.animations.play("walk", 50, false, true);
}

function score() {
  txtscore = gobins.add.text(1, 1, "SCORE:00", {
    fontSize: "30px",
    fill: "#fff",
    align: "center"
  });

  txtscore.font = "Arial Black";
  txtscore.stroke = "#222";
  txtscore.strokeThickness = 6;
}

function level() {
  txtlevel = gobins.add.text(350, 1, "LEVEL:" + numlevel, {
    fontSize: "30px",
    fill: "#fff",
    align: "center"
  });
  txtlevel.font = "Arial Black";
  txtlevel.stroke = "#222";
  txtlevel.strokeThickness = 6;
}

function aleatorio() {
  return Math.floor(Math.random() * 300 + 80);
}
