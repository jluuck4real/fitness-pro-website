import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const root = "C:/src/fitness_app";
fs.mkdirSync("public/institutional/screens", { recursive: true });
fs.mkdirSync("public/institutional/team", { recursive: true });
fs.mkdirSync("public/fonts", { recursive: true });
for (const name of [
  "onboarding",
  "home",
  "exercises",
  "exercise_detail",
  "session",
  "progress",
]) {
  const image = path.join(root, "artifacts/previews", name + ".png");
  await sharp(image)
    .resize({ width: 520, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(`public/institutional/screens/${name}.webp`);
  await sharp(image)
    .resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`public/institutional/screens/${name}-small.webp`);
}
for (const [name, file] of [
  ["joao", "oiiiiiii.jpeg"],
  ["raul", "raul.jpeg"],
  ["renato", "renato.jpeg"],
])
  await sharp(path.join("..", file))
    .resize({ width: 680, withoutEnlargement: true })
    .webp({ quality: 87 })
    .toFile(`public/institutional/team/${name}.webp`);
fs.copyFileSync(
  path.join(root, "assets/fonts/Manrope.ttf"),
  "public/fonts/Manrope.ttf",
);
fs.copyFileSync(
  path.join(root, "assets/fonts/OFL.txt"),
  "public/fonts/OFL.txt",
);
console.log("Capturas, fotos reais e fonte local preparadas.");
