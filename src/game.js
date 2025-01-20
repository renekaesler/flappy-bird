import { animate } from "#utils/graphics";
import { loadSync, play } from "#utils/media";

import background from "./layers/background.js";
import bird from "./layers/bird.js";
import ground from "./layers/ground.js";
import obstacles from "./layers/obstacles.js";
import prompt from "./layers/prompt.js";
import params from "./params.js";

const layers = [background, obstacles, ground, bird, prompt];

const sounds = {
  score: loadSync(Audio, "sfx/score.wav"),
};

function start() {
  params.mode = "running";

  bird.fall();
}

function over() {
  params.mode = "over";
  params.bestScore = Math.max(params.score, params.bestScore);
  localStorage.setItem("bestScore", params.bestScore);
}

function reset() {
  params.reset();
  bird.hover();
  obstacles.clear();
}

function tap() {
  switch (params.mode) {
    case "ready":
      start();

      break;
    case "running":
      bird.rise();

      break;
    case "over":
      if (bird.mode === "dead") {
        reset();
      }

      break;
  }
}

function update() {
  if (params.mode !== "running") return;

  const obstacle = obstacles.next();

  if (obstacle && bird.passed(obstacle.xMax)) {
    obstacle.passed = true;
    play(sounds.score);
    ++params.score;
  } else if (obstacle?.hit?.(bird) || ground.hit(bird)) {
    bird.crash();
    over();
  }
}

document.addEventListener("pointerdown", tap);
params.bestScore = Number(localStorage.getItem("bestScore") ?? 0);

animate(clock => {
  for (const layer of layers) {
    layer?.update?.(clock);
    layer?.draw?.(clock);
  }

  update(clock);
});
