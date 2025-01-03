import { snapshot } from "#utils/graphics";
import { loadSync } from "#utils/media";

import context from "../context.js";
import params from "../params.js";

const sprites = {
  getReady: loadSync(Image, "img/get-ready.png"),
  gameOver: loadSync(Image, "img/game-over.png"),
  tab: [loadSync(Image, "img/tap-0.png"), loadSync(Image, "img/tap-1.png")],
};

function drawText(txt, x, y) {
  context.fillText(txt, x, y);
  context.strokeText(txt, x, y);
}

function drawTap() {
  const { width, height } = context.canvas;

  const tab = snapshot(sprites.tab, 5);
  const x = (width - tab.width) / 2 - 7;
  const y = height - tab.height - 130;

  context.drawImage(tab, x, y);
}

export default {
  draw({ elapsed }) {
    const { width } = context.canvas;

    context.fillStyle = "#FFFFFF";
    context.font = "40px Squada One";

    context.lineWidth = "2";

    switch (params.mode) {
      case "ready":
        context.drawImage(
          sprites.getReady,
          (width - sprites.gameOver.width) / 2,
          125
        );

        drawTap(elapsed);

        break;

      case "over":
        context.drawImage(
          sprites.gameOver,
          (width - sprites.gameOver.width) / 2,
          125
        );

        context.textAlign = "end";

        drawText("SCORE:", 155, 200);
        drawText(params.score, 215, 200);

        drawText("BEST:", 155, 235);
        drawText(params.bestScore, 215, 235);

        drawTap(elapsed);

        break;
      case "running":
        context.textAlign = "center";

        drawText(params.score, context.canvas.width / 2, 40);
    }
  },
};
