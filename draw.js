const { stdout, stdin } = process;
const chalk = require('chalk');
const { exit } = require('process');

const BRUSH = '🖌\n', HIDDEN_CURSOR = '\x1B[?25l',
  VISIBLE_CURSOR = '\x1B[?25h';

const getDelta = (direction) => {
  const movements = {
    d: { dx: 2, dy: 0 },
    a: { dx: -2, dy: 0 },
    w: { dx: 0, dy: -1 },
    s: { dx: 0, dy: 1 },
  };
  return movements[direction];
};

class Brush {
  constructor({ x, y, maxX, maxY }) {
    this.x = x;
    this.y = y;
    this.maxX = maxX;
    this.maxY = maxY;
    this.color = 'cyan';
  }

  move(direction) {
    const { dx, dy } = getDelta(direction);
    this.x += dx;
    this.y += dy;
  }

  visit(brushVisitor) {
    brushVisitor(this.x, this.y, this.color);
  }

  changeColor(color) {
    const colors = {
      r: 'red',
      b: 'cyan',
      g: 'green',
      v: 'magenta'
    };
    this.color = colors[color];
  }
}

const draw = (brush) => {
  brush.visit((x, y, color) => {
    stdout.cursorTo(x, y);
    stdout.write(chalk[color]('*'));
  });
};

const set = (brush) => {
  brush.visit((x, y) => {
    stdout.cursorTo(x, y);
    stdout.write(BRUSH);
  });
};

const setupScreen = () => {
  stdout.cursorTo(0, 0);
  stdout.write(HIDDEN_CURSOR);
  stdout.clearScreenDown();
};

const resetScreen = () => {
  stdout.cursorTo(0, 0);
  stdout.write(VISIBLE_CURSOR);
  stdout.clearScreenDown();
};

const paint = (keyStroke, paintBrush) => {
  draw(paintBrush);
  paintBrush.move(keyStroke);
  set(paintBrush);
};

const isKeyValid = (key) => 'aswdq'.includes(key);

const moveBrush = (key, paintBrush) => {
  if (key === 'q') {
    resetScreen();
    exit();
  }
  paint(key, paintBrush);
};

const setupCanvas = () => {
  const [maxX, maxY] = stdout.getWindowSize();
  setupScreen();
  const paintBrush = new Brush({ x: 60, y: 20, maxX, maxY });
  set(paintBrush);
  return paintBrush;
};

const main = () => {
  const paintBrush = setupCanvas();
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.on('data', (key) => {
    if (!isKeyValid(key)) {
      return;
    }
    moveBrush(key, paintBrush);
  });
};

main();
