// Prepara las imágenes del hero a partir de tus generaciones de Nano Banana.
//
// Uso:
//   1. Genera en Nano Banana la CABINA y el CIELO (ver prompts en el chat).
//   2. Guarda los archivos en  public/images/hero/_src/
//        - cabin.(png|jpg|jpeg|webp)   → la cabina con la ventanilla al cielo
//        - sky.(png|jpg|jpeg|webp)     → el cielo sobre las nubes
//   3. Ejecuta:  node scripts/prep-hero.mjs   (o  npm run prep:hero)
//
// Salida (lo que consume el hero, sobrescribe los placeholders):
//   public/images/hero/latam-cabin.webp   2400×1350 (16:9)
//   public/images/hero/latam-sky.webp     2048×2048 (cuadrada, cubre cualquier viewport)

import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const HERO_DIR = "public/images/hero";
const SRC_DIR = join(HERO_DIR, "_src");
const EXTS = ["png", "jpg", "jpeg", "webp", "avif"];

/** Busca <name>.<ext> dentro de _src probando las extensiones habituales. */
function findSource(name) {
  for (const ext of EXTS) {
    const path = join(SRC_DIR, `${name}.${ext}`);
    if (existsSync(path)) return path;
  }
  return null;
}

async function build({ name, out, width, height }) {
  const src = findSource(name);
  if (src === null) {
    console.warn(
      `⚠  No encontré ${name}.(${EXTS.join("|")}) en ${SRC_DIR} — omito ${out} (se mantiene el placeholder).`,
    );
    return false;
  }
  const target = join(HERO_DIR, out);
  await sharp(src)
    .resize(width, height, { fit: "cover", position: "centre" })
    .webp({ quality: 84, effort: 5 })
    .toFile(target);
  console.log(`✓  ${src}  →  ${target}  (${width}×${height})`);
  return true;
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    mkdirSync(SRC_DIR, { recursive: true });
    console.log(`Creé ${SRC_DIR}. Deja ahí cabin.* y sky.* y vuelve a ejecutar.`);
    return;
  }

  const cabin = await build({ name: "cabin", out: "latam-cabin.webp", width: 2400, height: 1350 });
  const sky = await build({ name: "sky", out: "latam-sky.webp", width: 2048, height: 2048 });

  if (cabin || sky) {
    console.log("\nListo. Recarga http://localhost:3000 y haz scroll para ver el zoom.");
    console.log(
      "Si la ventanilla no queda centrada con el zoom, ajusta WINDOW_ORIGIN en src/components/jobs/JobHero.tsx.",
    );
  } else {
    console.log("\nNo se generó nada: revisa que los archivos estén en", SRC_DIR);
  }
}

main().catch((error) => {
  console.error("Error preparando el hero:", error);
  process.exitCode = 1;
});
