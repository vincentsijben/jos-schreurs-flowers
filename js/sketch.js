let rotRange = 10;
let rotDecay = 1.1;
let createCanvasDecay = 0.7;
let lengthDecay = 0.91;
let levelMax = 8;
let leafLevel = 4;
let leafChance = 0.3;

let startLength;
let startSize;
let trunkColor;
let bgColor;

let lengthRand = 1.0;
let bloomWidthRatio = 0.6;
let bloomSizeAverage = 15;

let flowerChance = 0.1;
let flowerColor;
let flowerWidth = 10;
let flowerHeight = 20;

let node;

function setup() {
  createCanvas(940*4, 540*4);
  pixelDensity(2);
  colorMode(HSB);
  ellipseMode(CENTER);

  randomize();
  background(bgColor);
  node = new Node(startLength, startSize, rotRange, 0);
}

function draw() {


  
  background(bgColor);
  translate(width/2, height);
  node.draw();

}


function randomize() {
  bgColor = color(random(255), random(0, 100), 255);

  rotRange = random(20, 60);
  rotDecay = random(0.9, 1.1);
  startLength = random(20, 80);
  startSize = random(3, 20);
  lengthRand = random(0.0, 0.2);
  leafChance = random(0.3, 0.9);
  createCanvasDecay = random(0.6, 0.7);
  lengthDecay = map(startLength, 20, 80, 1.1, 0.85);
  leafLevel = random(0, 4);
  bloomWidthRatio = random(0.01, 0.9);
  bloomSizeAverage = random(10, 40);

  flowerWidth = random(5, 15);
  flowerHeight = random(10, 30);
  flowerChance = 0.1;
}


function mousePressed() {
  saveFrames('out', 'png', 1, 1);
  // randomize();
  // background(bgColor);
  // node = new Node(startLength, startSize, rotRange, 0);
  
}

class Node {
  // let len;
  // let createCanvas;
  // let rot;
  // let level;
  // let s = 0;
  // let windFactor = 1.0;
  // let doesBloom;
  // color branchColor;
  // let bloomSize;
  // color leafColor;
  // let leafRot;
  // let leafScale = 0.0;
  // let leafDelay;
  // let doesFlower;
  // let flowerScale = 0.0;
  // let flowerScaleT = 1.0;
  // let flowerBright = 255;
  // let flowerDelay;

  // Node n1;
  // Node n2;

  constructor(_len, _createCanvas, _rotRange, _level) {
    this.len = _len * (1 + random(-lengthRand, lengthRand));
    this.createCanvas = _createCanvas;
    this.level = _level;
    this.rot = radians(random(-_rotRange, _rotRange));
    if (this.level < leafLevel) this.rot *= 0.3;
    if (this.level == 0 ) this.rot = 0;
    this.doesBloom = false;
    if (this.level >= leafLevel && random(1) < leafChance) this.doesBloom = true;
    this.bloomSize = random(bloomSizeAverage*0.7, bloomSizeAverage*1.3);
    this.leafRot = radians(random(-180, 180));
    this.flowerScaleT = random(0.8, 1.2);
    this.flowerDelay = round(random(200, 250));
    this.leafDelay = round(random(50, 150));
    this.branchColor = color(random(20, 60), random(35, 55), random(20, 35));
    this.leafColor = color(120, 100, random(20, 70));
    

    if (random(1) < flowerChance) this.doesFlower = true;

    let rr = _rotRange * rotDecay;

    if (this.level < levelMax) {
      this.n1 = new Node(this.len*lengthDecay, this.createCanvas*createCanvasDecay, rr, this.level+1);
      this.n2 = new Node(this.len*lengthDecay, this.createCanvas*createCanvasDecay, rr, this.level+1);
    }
  }


  draw() {
    strokeWeight(this.createCanvas);
    this.s += (1.0 - this.s) / (15 + (this.level*5));
    scale(this.s);
    push();
    scale(1.2);
    if (this.level >= leafLevel) stroke(this.branchColor);
    else stroke(0);
    rotate(this.rot);
    line(0, 0, 0, -this.len);
    translate(0, -this.len);

    // draw leaves
    if (this.doesBloom) {
      if (this.leafDelay < 0) {
        this.leafScale += (1.0 - this.leafScale) * 0.05;
        fill(this.leafColor);
        noStroke();
        push();
        scale(this.leafScale);
        rotate(this.leafRot);
        translate(0, -this.bloomSize/2);
        ellipse(0, 0, this.bloomSize*bloomWidthRatio, this.bloomSize);
        pop();
      }
      else {
        this.leafDelay--;
      }
    }

    // draw flowers
    if (this.doesFlower && this.level > levelMax-3) {
      if (this.flowerDelay < 0) {
        push();
        this.flowerScale += (this.flowerScaleT - this.flowerScale) * 0.1;
        scale(this.flowerScale);
        rotate(this.flowerScale*3);
        noStroke();
        fill(random(255), random(255), this.flowerBright);
        fill(350,100,50);
        ellipse(0, 0, flowerWidth, flowerHeight);
        rotate(radians(360/3));
        ellipse(0, 0, flowerWidth, flowerHeight);
        rotate(radians(360/3));
        ellipse(0, 0, flowerWidth, flowerHeight);
        fill(this.branchColor);
        ellipse(0, 0, 5, 5);
        pop();
      } else {
        this.flowerDelay--;
      }
    }
    push();
    if (this.n1) this.n1.draw();
    pop();
    push();
    if (this.n2) this.n2.draw();
    pop();
    pop();
  }

 
}