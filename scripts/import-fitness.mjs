import fs from "node:fs";
const file = "C:/src/fitness_app/lib/models/exercise_catalog.dart";
const dart = fs.readFileSync(file, "utf8");
const re =
  /ExerciseInfo\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*\[([\s\S]*?)\],\s*\)/g;
const ids = [
  "supino",
  "agachamento",
  "rosca",
  "puxada",
  "desenvolvimento",
  "triceps",
  "prancha",
  "elevacao-lateral",
];
const equipment = [
  "Barra e banco",
  "Peso corporal",
  "Barra ou halteres",
  "Polia",
  "Halteres",
  "Polia",
  "Colchonete",
  "Halteres",
];
const photos = [
  "photo-1534438327276-14e5300c3a48",
  "photo-1574680096145-d05b474e2155",
  "photo-1581009146145-b5ef050c2e1e",
  "photo-1534438327276-14e5300c3a48",
  "photo-1583454110551-21f2fa2afe61",
  "photo-1581009146145-b5ef050c2e1e",
  "photo-1517836357463-d25dfeac3438",
  "photo-1583454110551-21f2fa2afe61",
];
const data = [...dart.matchAll(re)].map((m, i) => ({
  id: ids[i],
  name: m[1],
  muscle: m[2],
  description: m[3],
  videoId: m[4],
  steps: [...m[5].matchAll(/'([^']+)'/g)].map((s) => s[1]),
  equipment: equipment[i],
  level: i === 0 || i === 4 ? "Intermediário" : "Fundamental",
  image: `https://images.unsplash.com/${photos[i]}?auto=format&fit=crop&w=900&q=85`,
  tips: "Priorize controle, estabilidade e uma amplitude confortável. Ajuste a carga com orientação profissional.",
  errors: "Usar impulso, perder o alinhamento ou continuar com dor.",
  source:
    "Fitness App · lib/models/exercise_catalog.dart. Equipamentos, dicas e erros: complemento editorial web.",
}));
if (data.length !== 8) throw Error("Catálogo inesperado");
fs.writeFileSync(
  "lib/imported-exercises.json",
  JSON.stringify(data, null, 2) + "\n",
);
console.log(`Importados ${data.length} exercícios do Fitness App.`);
