const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const linearToSrgb = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function linearSrgbToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

function oklabToLinearSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function oklabToOklch(L, a, b) {
  const C = Math.hypot(a, b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function oklchToOklab(L, C, H) {
  const h = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(h), b: C * Math.sin(h) };
}

export function rgbToOklch(r, g, b) {
  const lab = linearSrgbToOklab(
    srgbToLinear(r / 255),
    srgbToLinear(g / 255),
    srgbToLinear(b / 255),
  );
  return oklabToOklch(lab.L, lab.a, lab.b);
}

function inGamut(L, C, H, eps = 0.0005) {
  const { a, b } = oklchToOklab(L, C, H);
  const { r, g, b: bl } = oklabToLinearSrgb(L, a, b);
  return (
    r >= -eps && r <= 1 + eps &&
    g >= -eps && g <= 1 + eps &&
    bl >= -eps && bl <= 1 + eps
  );
}

export function gamutClampOklch({ L, C, H }) {
  const Lc = Math.min(1, Math.max(0, L));
  if (inGamut(Lc, C, H)) return { L: Lc, C, H };

  let lo = 0;
  let hi = C;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(Lc, mid, H)) lo = mid;
    else hi = mid;
  }
  return { L: Lc, C: lo, H };
}

export function oklchToRgb255(oklch) {
  const { L, C, H } = gamutClampOklch(oklch);
  const { a, b } = oklchToOklab(L, C, H);
  const lin = oklabToLinearSrgb(L, a, b);
  const to255 = (v) =>
    Math.round(Math.min(1, Math.max(0, linearToSrgb(Math.min(1, Math.max(0, v))))) * 255);
  return [to255(lin.r), to255(lin.g), to255(lin.b)];
}

export function oklchToRgbTriplet(oklch) {
  const [r, g, b] = oklchToRgb255(oklch);
  return `${r} ${g} ${b}`;
}

export function oklchToHex(oklch) {
  const [r, g, b] = oklchToRgb255(oklch);
  const h = (n) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function parseRgbTriplet(str) {
  const nums = String(str)
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
  return nums.length >= 3 ? [nums[0], nums[1], nums[2]] : null;
}

export const lerp = (a, b, t) => a + (b - a) * t;

export function hueLerp(a, b, t) {
  const delta = (((b - a) % 360) + 540) % 360 - 180;
  return (a + delta * t + 360) % 360;
}

export function lerpOklch(from, to, t) {
  return {
    L: lerp(from.L, to.L, t),
    C: lerp(from.C, to.C, t),
    H: hueLerp(from.H, to.H, t),
  };
}

// Mean chroma (over all opaque pixels) below this reads as black & white.
// B&W album art is usually a *color*-encoded JPEG, so it carries a faint,
// systematic blue/green cast from the YCbCr pipeline — coherent enough to
// survive the colored-pixel gate and produce a bogus blue/green accent.
// Below this floor we flag it grayscale instead. Tune against real covers.
const GRAYSCALE_MEAN_C = 0.025;

export function extractAccentFromImage(url) {
  return new Promise((resolve) => {
    if (!url || typeof document === "undefined") {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      try {
        const N = 40;
        const canvas = document.createElement("canvas");
        canvas.width = N;
        canvas.height = N;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, N, N);
        const { data } = ctx.getImageData(0, 0, N, N);

        let sumSin = 0;
        let sumCos = 0;
        let sumC = 0;
        let sumL = 0;
        let sumW = 0;
        let sumAllC = 0;
        let colored = 0;
        let total = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          total++;

          const { L, C, H } = rgbToOklch(data[i], data[i + 1], data[i + 2]);
          sumAllC += C;
          if (C < 0.02) continue;

          const lightWindow = Math.max(0, 1 - Math.abs(L - 0.6) / 0.55);
          const w = C * C * lightWindow;
          if (w <= 0) continue;

          const h = (H * Math.PI) / 180;
          sumSin += w * Math.sin(h);
          sumCos += w * Math.cos(h);
          sumC += w * C;
          sumL += w * L;
          sumW += w;
          colored++;
        }

        const grayscale = total > 0 && sumAllC / total < GRAYSCALE_MEAN_C;

        if (sumW <= 0 || colored < total * 0.05) {
          resolve(grayscale ? { grayscale: true } : null);
          return;
        }

        let H = (Math.atan2(sumSin, sumCos) * 180) / Math.PI;
        if (H < 0) H += 360;
        resolve({ L: sumL / sumW, C: sumC / sumW, H, grayscale });
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = url;
  });
}
