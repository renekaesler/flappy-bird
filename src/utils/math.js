export function clamp(min, value, max) {
  return Math.min(Math.max(min, value), max);
}

export const vec = {
  abs(out, v) {
    out[0] = Math.abs(v[0]);
    out[1] = Math.abs(v[1]);
  },

  sub(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
  },

  distance(a, b) {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
  },
};
