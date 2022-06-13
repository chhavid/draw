const { stdout, stdin, exit } = require('process');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const { Brush } = require('./brush.js');

const BRUSH = '🖌\n', HIDDEN_CURSOR = '\x1B[?25l',
  VISIBLE_CURSOR = '\x1B[?25h';

const draw = (brush) => {
  brush.visit((x, y, color, filler) => {
    stdout.cursorTo(x, y);
    stdout.write(chalk[color](filler));
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

const isKeyValid = (key) => 'aswdqpha'.includes(key);

const setModes = (modes, paintBrush) => {
  modes.on('q', () => {
    resetScreen();
    exit();
  });
  modes.on('p', () => paintBrush.setPaintMode());
  modes.on('h', () => paintBrush.unsetPaintMode());
  modes.on('w', () => paint('w', paintBrush));
  modes.on('a', () => paint('a', paintBrush));
  modes.on('s', () => paint('s', paintBrush));
  modes.on('d', () => paint('d', paintBrush));
};

const setupCanvas = () => {
  const [maxX, maxY] = stdout.getWindowSize();
  setupScreen();
  const paintBrush = new Brush({ x: 60, y: 20, maxX, maxY: maxY - 1 });
  set(paintBrush);
  const modes = new EventEmitter();
  setModes(modes, paintBrush);
  return modes;
};

const main = () => {
  const modes = setupCanvas();
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  stdin.on('data', (key) => {
    if (!isKeyValid(key)) {
      return;
    }
    modes.emit(key);
  });
};

main();
