export function animate(tick) {
  let lastTick = 0;

  requestAnimationFrame(function cb(elapsed) {
    requestAnimationFrame(cb);

    tick({ delta: elapsed - lastTick, elapsed });
    lastTick = elapsed;
  });
}

export function snapshot(sequence, fps = sequence.length) {
  const idx = Math.floor((Date.now() * 0.001 * fps) % sequence.length);

  return sequence[idx];
}

export function prerender(draw) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  draw(context);

  return canvas;
}
