import { loadSound, playSound } from "#utils/audio";
import { snapshot } from "#utils/graphics";
import { loadSync } from "#utils/media";
import { clamp } from "#utils/math";

import context from "../context.js";
import params from "../params.js";

const WEIGHTLESS = "weightless";
const HEAVY = "heavy";
const DEAD = "dead";

loadSound("fall", "sfx/fall.wav");
loadSound("rise", "sfx/rise.wav");
loadSound("crash", "sfx/crash.wav");
loadSound("die", "sfx/die.wav");

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
    playSound("fall");
  },

  rise() {
    if (params.mode !== "running") return;

    this.speed = -params.thrust;
    playSound("rise");
  },

  crash() {
    this.speed = -0.1;
    playSound("crash");
  },

  die() {
    this.mode = DEAD;
    playSound("die");
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
