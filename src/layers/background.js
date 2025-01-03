import { prerender } from "#utils/graphics";
import { load } from "#utils/media";

import context from "../context.js";
import params from "../params.js";

const sprite = prerender(async ctx => {
  const { height } = context.canvas;
  const img = await load(Image, "img/background.png");

  ctx.canvas.width = img.width * 2;
  ctx.canvas.height = height;

  ctx.drawImage(img, 0, height - img.height);
  ctx.drawImage(img, img.width, height - img.height);
});

let x = 0;

export default {
  update({ delta }) {
    if (params.mode !== "running") return;

    const { width } = context.canvas;

    x = (x - delta * params.groundSpeed * 0.1) % width;
  },

  draw() {
    const { height } = context.canvas;
    context.drawImage(sprite, x, height - sprite.height);
  },
};
