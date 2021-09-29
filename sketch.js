class Wall {
  constructor() {
    this.origin = createVector(250, 200);
    this.width = createVector(250, 0);
    this.height = createVector(0, 50);
    this.newOrigin = this.origin;
    this.newWidth = this.width;
    this.newHeight = this.height;
  }

  update() {
    fill(150);
    quad(this.origin.x, this.origin.y, this.origin.x + this.width.x, this.origin.y + this.width.y, this.origin.x + this.width.x + this.height.x, this.origin.y + this.width.y + this.height.y, this.origin.x + this.height.x, this.origin.y + this.height.y);
  }

  reset() {
    if (!this.newOrigin || !this.newWidth || !this.newHeight) {
      this.newOrigin = createVector(250, 200);
      this.newWidth = createVector(250, 0);
      this.newHeight = createVector(0, 50);
    }

    this.origin = this.newOrigin;
    this.width = this.newWidth;
    this.height = this.newHeight;
  }
}

class Point {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.originalPosition = this.position;
    this.velocity = createVector(0, 1);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    rect(this.position.x, this.position.y, 1, 1);
  }

  checkOnScreen() {
    return ((this.position.x > 800 || this.position.y > 800 || this.position.x < 0 || this.position.y < 0))
  }

  checkCollision(x1, y1, x2, y2, ox, oy) {
    let localX = (y1 * this.position.x - this.position.y * x1 - y1 * ox + x1 * oy) / (y1 * x2 - x1 * y2);

    let localY = (this.position.x - localX * x2 - ox) / x1;

    //let max = createVector(ox + x1 + y1, oy + x2 + y2);
    //let localX = (this.position.x - ox) / (max.x - ox);
    //let localY = (this.position.y - oy) / (max.y - oy);

    return localX > 0 && localX < 1 && 0 < localY && localY < 1;
  }

  reset() {
    this.position = createVector(this.originalPosition.x, this.originalPosition.y);
    this.velocity = createVector(random(0, 0.7), -random(0.7, 1));
  }
}

resetButton = new Clickable();
resetButton.locate(50, 750);
resetButton.color = 'rgb(50, 255, 0)';
resetButton.resize(100, 25);
resetButton.text = ("Reset");
resetButton.onPress = function () {
  wall.reset();
  movingPoints = [];
}


function setup() {
  createCanvas(800, 800);

  let wallOrigin = createInput('Input Origin x, y');
  wallOrigin.position(820, 5);
  wallOrigin.size(120);
  wallOrigin.input(originInput);

  let inputWidthVector = createInput('Input Width x, y');
  inputWidthVector.position(820, 35);
  inputWidthVector.size(120);
  inputWidthVector.input(widthInput);

  let inputHeightVector = createInput('Input Height x, y');
  inputHeightVector.position(820, 65);
  inputHeightVector.size(120);
  inputHeightVector.input(heightInput);

  wall = new Wall();
  movingPoints = [];
}

function draw() {
  background(200);
  resetButton.draw();
  wall.update();

  for (i = 0; i < movingPoints.length; i++) {
    movingPoints[i].update();
    if (movingPoints[i].checkOnScreen()) {
      movingPoints.splice(movingPoints, i);
    }
    else {
      if (movingPoints[i].checkCollision(wall.width.x, wall.width.y, wall.height.x, wall.height.y, wall.origin.x, wall.origin.y)) {
        movingPoints[i].velocity = createVector(0, 0);
      }
    }
  }
}

function mousePressed() {
  newPoint = new Point(mouseX, mouseY);
  newPoint.velocity = createVector((wall.origin.x + wall.width.x / 2) - newPoint.position.x, (wall.origin.y + wall.height.y / 2) - newPoint.position.y).normalize();
  movingPoints.push(newPoint);
}

function originInput() {
  x = 0;
  y = 0;
  stringstore = '';
  input = this.value();

  for (i = 0; i < input.length; i++) {
    if (input[i] != ',') {
      stringstore += input[i];
    } else {
      x = stringstore;
      stringstore = '';
    }
  }

  y = stringstore;

  wall.newOrigin = createVector(parseFloat(x), parseFloat(y));
}

function widthInput() {
  x = 0;
  y = 0;
  stringstore = '';
  input = this.value();
  for (i = 0; i < input.length; i++) {
    if (input[i] != ',') {
      stringstore += input[i];
    } else {
      x = stringstore;
      stringstore = '';
    }
  }

  y = stringstore;

  wall.newWidth = createVector(parseFloat(x), parseFloat(y));
}

function heightInput() {
  x = 0;
  y = 0;
  stringstore = '';
  input = this.value();
  for (i = 0; i < input.length; i++) {
    if (input[i] != ',') {
      stringstore += input[i];
    } else {
      x = stringstore;
      stringstore = '';
    }
  }

  y = stringstore;

  wall.newHeight = createVector(parseFloat(x), parseFloat(y));
}
