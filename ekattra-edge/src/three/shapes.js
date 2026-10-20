export const SHAPE = { SCATTER: 0, SPHERE: 1, FIELD: 2, TRIAD: 3, ORBITS: 4, KNOT: 5 };

export const TRIAD_CENTRES = [[0, 1.05, 0], [-1.15, -0.85, 0], [1.15, -0.85, 0]];

const randDir = () => {
  const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
  return [r * Math.cos(th), u, r * Math.sin(th)];
};

export function buildShapes(n) {
  const rnd = new Float32Array(n);
  const cluster = new Float32Array(n);
  const shapes = Array.from({ length: 6 }, () => new Float32Array(n * 3));
  const [scatter, sphere, field, triad, orbits, knot] = shapes;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const cols = Math.round(Math.sqrt(n * 1.5));
  const rows = Math.ceil(n / cols);
  const tilt = 0.62;

  for (let i = 0; i < n; i++) {
    const o = i * 3;
    const r0 = Math.random();
    rnd[i] = r0;
    const k = i % 3;
    cluster[i] = k;

    scatter[o] = (Math.random() - 0.5) * 15;
    scatter[o + 1] = (Math.random() - 0.5) * 9;
    scatter[o + 2] = (Math.random() - 0.5) * 6 - 1;

    const y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - y * y), th = golden * i;
    const R = 1.7 * (0.95 + Math.random() * 0.1);
    sphere[o] = Math.cos(th) * rr * R;
    sphere[o + 1] = y * R;
    sphere[o + 2] = Math.sin(th) * rr * R;

    const c = i % cols, rw = Math.floor(i / cols);
    const fx = (c / (cols - 1) - 0.5) * 4.2, fz = (rw / (rows - 1) - 0.5) * 3.4;
    const fy = 0.3 * Math.sin(fx * 1.9) + 0.22 * Math.cos(fz * 2.4 + fx * 1.1);
    field[o] = fx;
    field[o + 1] = fy * Math.cos(tilt) - fz * Math.sin(tilt);
    field[o + 2] = fy * Math.sin(tilt) + fz * Math.cos(tilt);

    if (r0 < 0.14) {
      const a = TRIAD_CENTRES[k], b = TRIAD_CENTRES[(k + 1) % 3], t = Math.random();
      triad[o] = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * 0.04;
      triad[o + 1] = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * 0.04;
      triad[o + 2] = (Math.random() - 0.5) * 0.04;
    } else {
      const d = randDir(), cr = 0.5 + Math.random() * 0.1, cc = TRIAD_CENTRES[k];
      triad[o] = cc[0] + d[0] * cr;
      triad[o + 1] = cc[1] + d[1] * cr;
      triad[o + 2] = cc[2] + d[2] * cr;
    }

    const ring = i % 5, oR = 0.62 + ring * 0.34, oth = Math.random() * Math.PI * 2, ot = 1.15 + ring * 0.09;
    const ox = Math.cos(oth) * oR, oz = Math.sin(oth) * oR, jit = 0.03;
    orbits[o] = ox + (Math.random() - 0.5) * jit;
    orbits[o + 1] = -oz * Math.sin(ot) * 0.9 + (ring - 2) * 0.05 + (Math.random() - 0.5) * jit;
    orbits[o + 2] = oz * Math.cos(ot) + (Math.random() - 0.5) * jit;

    const kt = (i / n) * Math.PI * 2, kd = randDir(), kr = 0.1 * Math.random() ** 0.5, ks = 0.52;
    knot[o] = (Math.sin(kt) + 2 * Math.sin(2 * kt)) * ks + kd[0] * kr;
    knot[o + 1] = (Math.cos(kt) - 2 * Math.cos(2 * kt)) * ks + kd[1] * kr;
    knot[o + 2] = -Math.sin(3 * kt) * ks + kd[2] * kr;
  }
  return { shapes, rnd, cluster };
}