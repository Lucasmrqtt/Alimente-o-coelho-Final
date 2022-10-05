const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var canW, canH;
var link1, link2, link3;
var fruit, fruitImg;
var rope1, rope2, rope3;
var ground;
var backGroundImg;
var rabbit, rabbitImg;
var sad, blink, eat;
var cutButton, cutButton2, cutButton3;
var resetButton, airButton, muteButton;
var soundAir, soundCut, soundEat, soundSad, soundBg;
var volume = 0;

let engine;
let world;

function preload() {
  
  fruitImg = loadImage ("./images/melon.png");
  rabbitImg = loadImage ("./images/Rabbit-01.png");
  sad = loadAnimation ("./images/sad_1.png","./images/sad_2.png","./images/sad_3.png");
  blink = loadAnimation ("./images/blink_1.png","./images/blink_2.png","./images/blink_3.png");
  eat = loadAnimation ("./images/eat_0.png","./images/eat_1.png","./images/eat_2.png","./images/eat_3.png","./images/eat_4.png");
  backGroundImg = loadImage("./images/background.png");
  soundAir = loadSound ("./sounds/air.wav")
  soundCut = loadSound ("./sounds/rope_cut.mp3")
  soundEat = loadSound ("./sounds/eating_sound.mp3") 
  soundSad = loadSound ("./sounds/sad.wav")
  soundBg = loadSound ("./sounds/sound1.mp3")
  blink.playing = true 
  eat.playing = true
  eat.looping = false
  sad.playing = true
  sad.looping = false
}


function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (isMobile) {
    canW = displayWidth-50
    canH = displayHeight-50
  } else {
    canW = windowWidth-50
    canH = windowHeight-50
  }

  createCanvas(canW, canH);

  engine = Engine.create();
  world = engine.world;

  cutButton = createImg("./images/cut_button.png")
  cutButton.size (50,50);
  cutButton.position (290,60);
  cutButton.mouseClicked (drop);

  cutButton2 = createImg("./images/cut_button.png")
  cutButton2.size (50,50);
  cutButton2.position (60,150);
  cutButton2.mouseClicked (drop2);

  cutButton3 = createImg("./images/cut_button.png")
  cutButton3.size (50,50);
  cutButton3.position (180,330);
  cutButton3.mouseClicked (drop3);

  resetButton = createImg("./images/reset.png")
  resetButton.size (50,50);
  resetButton.position (20,20);
  resetButton.mouseClicked (reset);

  airButton = createImg("./images/balloon.png");
  airButton.size (150,100);
  airButton.position (-20,180);
  airButton.mouseClicked(air);

  muteButton = createImg("./images/mute.png");
  soundBg.play();
  soundBg.setVolume(0.2)
  muteButton.size (50,50);
  muteButton.position (80,20);
  muteButton.mouseClicked(mute);

  blink.frameDelay = 15;
  sad.frameDelay = 15;
  eat.frameDelay = 15;
  rabbit = createSprite(300,height-70);
  rabbit.addAnimation("blink", blink);
  rabbit.addAnimation("sad", sad);
  rabbit.addAnimation("eat", eat);
  rabbit.scale = 0.2;


  ground = Bodies.rectangle(width/2,height-5, width, 10, {isStatic: true});
  World.add(world, ground);

  rope1 = new Rope(5,{x:310, y:80})
  rope2 = new Rope(5,{x:60,y:150}) 
  rope3 = new Rope(3,{x:190, y:350})

  fruit = Bodies.circle(300,300,15);
  Composite.add(rope1.body,fruit);

  link1 = new Link(rope1,fruit);
  link2 = new Link(rope2,fruit);
  link3 = new Link(rope3,fruit);
  
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50);

  
}

function draw() {
  background(51);
  image(backGroundImg, width/2, height/2, width, height)

  Engine.update(engine);

  rect(ground.position.x,ground.position.y, width, 10);

  rope1.show();
  rope2.show();
  rope3.show();

  if (fruit != null ) {
    image(fruitImg, fruit.position.x,fruit.position.y, 60,60);
  }

  if (collide(fruit, rabbit)) {
    World.remove(world,fruit)
    fruit = null
    rabbit.changeAnimation ("eat")
    soundEat.play();
    soundEat.setVolume(1.5)
    }

  if (fruit != null && fruit.position.y > rabbit.position.y) {
    World.remove(world,fruit)
    fruit = null
    rabbit.changeAnimation ("sad")
    soundSad.play();
  }

  drawSprites();

  textSize (20);
  text("X:"+mouseX+"  Y:"+mouseY,mouseX,mouseY);
  
}

function drop(){
  rope1.break();
  link1.detach();
  link1 = null;
  soundCut.play();
}

function drop2(){
  rope2.break();
  link2.detach();
  link2 = null;
  soundCut.play();
}

function drop3(){
  rope3.break();
  link3.detach();
  link3 = null;
  soundCut.play();
}

function reset() {
  window.location.reload();
}

function collide(body,sprite){
  if (body != null) {
    var distance = dist (body.position.x, body.position.y, sprite.position.x,sprite.position.y);
    if (distance <= 58) {
      return true
    } else {
      return false
    }
  }
}

function air() {
  if (fruit.position.y < 260) {
    Matter.Body.applyForce(fruit,{x:0, y:0},{x:0.01,y:0})
  }
  soundAir.play();
  soundAir.setVolume(0.4)
}

function mute() {
  if (volume == 0) {
    soundBg.setVolume (0.2)
    volume = 1
  } else {
    soundBg.setVolume (0)
    volume = 0
  }
}