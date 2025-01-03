import { snapshot } from "#utils/graphics";
import { loadSync, play } from "#utils/media";
import { clamp } from "#utils/math";

import context from "../context.js";
import params from "../params.js";

const WEIGHTLESS = "weightless";
const HEAVY = "heavy";
const DEAD = "dead";

const sounds = {
  fall: loadSync(Audio, "sfx/fall.wav"),
  rise: loadSync(Audio, "sfx/rise.wav"),
  crash: loadSync(Audio, "sfx/crash.wav"),
  die: loadSync(Audio, "sfx/die.wav"),
};

const sprites = {
  dead: loadSync(Image, "img/bird-dead.png"),
  flapping: [
    loadSync(Image, "img/bird-0.png"),
    loadSync(Image, "img/bird-1.png"),
    loadSync(Image, "img/bird-2.png"),
  ],
};

export default {
  mode: WEIGHTLESS,
  position: [...params.initialPosition],
  angle: 0,
  speed: 0,

  get radius() {
    return sprites.flapping[0].height / 2;
  },

  hover() {
    this.mode = WEIGHTLESS;
    this.angle = 0;
    this.speed = 0;
  },

  fall() {
    this.mode = HEAVY;
    play(sounds.fall);
  },

  rise() {
    if (params.mode !== "running") return;

    this.speed = -params.thrust;
    play(sounds.rise);
  },

  crash() {
    this.speed = -0.1;
    play(sounds.crash);
  },

  die() {
    this.mode = DEAD;
    play(sounds.die);
  },

  passed(x) {
    return x < this.position[0] - this.radius;
  },

  update({ delta, elapsed }) {
    const { height } = context.canvas;

    switch (this.mode) {
      case WEIGHTLESS:
        this.position[1] =
          params.initialPosition[1] + Math.sin(elapsed * 0.001) * 10;

        break;
      case HEAVY:
        this.position[1] += this.speed * delta;
        this.angle = clamp(Math.PI / -8, this.speed * 2, Math.PI / 2);
        this.speed += params.gravity * delta;

        if (this.position[1] >= height + sprites.flapping[0].height) {
          this.die();
        }

        break;
    }
  },

  draw() {
    let bird = sprites.dead;

    context.save();
    context.translate(...this.position);
    context.rotate(this.angle);

    if (params.mode === "over") {
      context.scale(1, -1);
    } else {
      bird = snapshot(sprites.flapping, 5);
    }

    context.drawImage(bird, bird.width / -2, bird.height / -2);
    context.restore();
  },
};
