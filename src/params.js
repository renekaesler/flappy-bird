const defaults = {
  mode: "ready",
  score: 0,
  groundSpeed: 0.1,
  initialPosition: [50, 90],
  gravity: 0.0008,
  thrust: 0.28,
  distance: 200,
  gap: 110,
};

export default {
  ...defaults,
  reset() {
    Object.assign(this, defaults);
  },
};
