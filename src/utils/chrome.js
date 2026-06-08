export function applyThemeColor(hex) {
  if (typeof document === "undefined") return;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", hex);
}

let faviconLink = null;
let canvas = null;

function ensureFaviconLink() {
  if (faviconLink) return faviconLink;
  document.querySelectorAll('link[rel="icon"]').forEach((el) => el.remove());
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  document.head.appendChild(link);
  faviconLink = link;
  return link;
}

export function applyFavicon(bgHex) {
  if (typeof document === "undefined") return;
  try {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const S = 64;
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = bgHex;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(0, 0, S, S, 12);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, S, S);
    }

    ctx.font =
      '40px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🐟", S / 2, S / 2 + 3);

    ensureFaviconLink().href = canvas.toDataURL("image/png");
  } catch {}
}
