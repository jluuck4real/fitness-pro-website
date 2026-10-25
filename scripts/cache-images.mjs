import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("lib/imported-exercises.json", "utf8"));
fs.mkdirSync("public/images", { recursive: true });
for (const url of [...new Set(data.map((e) => e.image))]) {
  const name = new URL(url).pathname.slice(1) + ".jpg";
  const response = await fetch(url);
  if (!response.ok) throw Error(response.status + " " + url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  fs.writeFileSync("public/images/" + name, bytes);
  for (const e of data) if (e.image === url) e.image = "/images/" + name;
  console.log(name, bytes.length);
}
fs.writeFileSync(
  "lib/imported-exercises.json",
  JSON.stringify(data, null, 2) + "\n",
);
