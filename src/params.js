import GUI from "lil-gui";

const gui = new GUI();

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

const params = {
  ...defaults,
  reset() {
    Object.assign(this, defaults);
  },
};

gui
  .add(params, "gap", 50, 250)
  .name("Abstand")
  .onChange(gap => {
    Object.assign(defaults, { gap });
  });

gui
  .add(params, "thrust", 0.05, 0.5)
  .name("Auftrieb")
  .onChange(thrust => {
    Object.assign(defaults, { thrust });
  });

gui
  .add(params, "gravity", 0.0004, 0.002)
  .name("Gravitation")
  .onChange(gravity => {
    Object.assign(defaults, { gravity });
  });

gui
  .add(params, "groundSpeed", 0, 1)
  .name("Geschwindigkeit")
  .onChange(groundSpeed => {
    Object.assign(defaults, { groundSpeed });
  });

gui.close();

export default params;
