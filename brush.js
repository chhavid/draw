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
  #x;
  #y;
  #maxX;
  #maxY;
  #color;
  #filler;
  #colorFlag;

  constructor({ x, y, maxX, maxY }) {
    this.#x = x;
    this.#y = y;
    this.#maxX = maxX;
    this.#maxY = maxY;
    this.#color = 'cyan';
    this.#filler = ' ';
    this.#colorFlag = false;
  }

  #isXOutOfScreen() {
    return this.#x >= this.#maxX || this.#x < 0;
  }
  #isYOutOfScreen() {
    return this.#y >= this.#maxY || this.#y < 0;
  }

  move(direction) {
    const { dx, dy } = getDelta(direction);
    this.#x += dx;
    this.#y += dy;
    if (this.#isXOutOfScreen()) {
      this.#x -= dx;
    }
    if (this.#isYOutOfScreen()) {
      this.#y -= dy;
    }
  }

  visit(brushVisitor) {
    brushVisitor(this.#x, this.#y, this.#color, this.#filler);
  }

  setPaintMode() {
    this.#filler = '*';
  }

  unsetPaintMode() {
    this.#filler = ' ';
  }

  setColorFlag() {
    this.#colorFlag = true;
  }

  #unsetColorFlag() {
    this.#colorFlag = false;
  }

  changeColor(color) {
    if (!this.#colorFlag) {
      return;
    }
    const colors = {
      r: 'red',
      b: 'cyan',
      g: 'green',
      m: 'magenta',
      y: 'yellow'
    };
    this.#color = colors[color];
    this.#unsetColorFlag();
  }
}

module.exports = { Brush };
