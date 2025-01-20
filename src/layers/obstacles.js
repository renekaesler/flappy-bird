import { prerender } from "#utils/graphics";
import { load } from "#utils/media";
import { vec } from "#utils/math";

import context from "../context.js";
import params from "../params.js";

const img = await load(Image, "img/pipe.png");

const sprite = prerender(async ctx => {
  const img = await load(Image, "img/pipe.png");

  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height * 2 + params.gap;

  ctx.drawImage(img, 0, img.height + params.gap);
  ctx.scale(1, -1);
  ctx.drawImage(img, 0, -img.height);
});

class Obstacle {
  constructor(x, y) {
    this.position = [x, y];
    this.width = 52;
    this.height = params.gap;
  }

  get xMax() {
    return this.position[0] + this.width / 2;
  }

  hit(bird) {
    const E = [this.width / 2, params.gap / 2];

    const B = [];
    vec.sub(B, this.position, bird.position);
    vec.abs(B, B);

    const B_min = [B[0] - bird.radius, B[1] + bird.radius];

    if (B_min[0] <= E[0] && B_min[1] >= E[1]) {
      if (B[0] <= E[0] || B[1] >= E[1] || bird.radius >= vec.distance(B, E)) {
        return true;
      }
    }

    return false;
  }
}

let distance = Infinity;
let obstacles = [];

export default {
  clear() {
    obstacles = [];
  },

  next() {
    return obstacles.find(h => !h.passed);
  },

  update({ delta, elapsed }) {
    if (params.mode !== "running") return;

    const { width, height } = context.canvas;

    if (distance >= params.distance) {
      const minY = params.gap / 2 + 30;
      const maxY = height - 112 - params.gap / 2 - 30;
      const range = maxY - minY;

      const obstacle = new Obstacle(width + 52, minY + Math.random() * range);

      obstacles.push(obstacle);
      distance = 0;
    } else {
      distance += params.groundSpeed * delta;
    }

    for (let i = obstacles.length - 1; i >= 0; --i) {
      const { position } = obstacles[i];
      position[0] -= delta * params.groundSpeed;

      if (position[0] < -sprite.width) {
        obstacles.splice(i, 1);
      }
    }
  },

  draw() {
    for (const { position, width } of obstacles) {
      // Render Prerendered Pipes

      // context.drawImage(
      //   sprite,
      //   position[0] - width / 2,
      //   position[1] - sprite.height / 2
      // );

      // Rerender pipe every time again

      context.save();
      context.translate(...position);

      const halfGap = params.gap / 2;
      const negHalfWidth = -width / 2;

      context.drawImage(img, negHalfWidth, halfGap);
      context.scale(1, -1);
      context.drawImage(img, negHalfWidth, halfGap);
      context.restore();
    }
  },
};
