import { prerender } from "#utils/graphics";
import { load } from "#utils/media";

import context from "../context.js";
import params from "../params.js";

const ground = prerender(async ctx => {
  const img = await load(Image, "img/ground.png");

  ctx.canvas.width = img.width * 2;
  ctx.canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
  ctx.drawImage(img, img.width, 0);
});

let x = 0;

export default {
  get y() {
    return context.canvas.height - ground.height;
  },

  hit(bird) {
    return this.y <= bird.position[1] + bird.radius;
  },

  update({ delta }) {
    if (params.mode !== "running") return;

    const { width } = context.canvas;
    x = (x - delta * params.groundSpeed) % (ground.width / 2);
  },

  draw() {
    context.drawImage(ground, x, this.y);
  },
};
