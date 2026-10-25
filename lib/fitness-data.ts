import catalog from "./imported-exercises.json";
export const exercises = catalog;
export type Exercise = (typeof exercises)[number];
export const routines = [
  {
    id: "fundamentos",
    name: "De volta ao movimento",
    tag: "CORPO INTEIRO",
    description: "Uma rotina de fundamentos para construir consistência.",
    minutes: 25,
    level: "Fundamental",
    image: exercises[1].image,
    items: [
      { id: "agachamento", sets: 3, reps: "10–12" },
      { id: "supino", sets: 3, reps: "8–12" },
      { id: "puxada", sets: 3, reps: "10–12" },
      { id: "prancha", sets: 3, reps: "20 segundos" },
    ],
  },
  {
    id: "superiores",
    name: "Força em cada detalhe",
    tag: "MEMBROS SUPERIORES",
    description: "Peito, costas, ombros e braços em uma sessão.",
    minutes: 35,
    level: "Intermediário",
    image: exercises[2].image,
    items: [
      { id: "puxada", sets: 3, reps: "10–12" },
      { id: "desenvolvimento", sets: 3, reps: "8–12" },
      { id: "rosca", sets: 3, reps: "10–12" },
      { id: "triceps", sets: 3, reps: "10–12" },
    ],
  },
  {
    id: "controle",
    name: "Controle é evolução",
    tag: "OMBROS + CORE",
    description: "Estabilidade e consciência de cada movimento.",
    minutes: 20,
    level: "Fundamental",
    image: exercises[6].image,
    items: [
      { id: "desenvolvimento", sets: 3, reps: "8–12" },
      { id: "elevacao-lateral", sets: 3, reps: "10–12" },
      { id: "prancha", sets: 3, reps: "20 segundos" },
    ],
  },
];
export type Session = {
  id: string;
  date: string;
  name: string;
  seconds: number;
  sets: number;
};
export type Profile = {
  name: string;
  goal: string;
  weeklyGoal: number;
  photo: string;
  reducedMotion: boolean;
  accent: string;
};
export const defaultProfile: Profile = {
  name: "",
  goal: "Criar consistência",
  weeklyGoal: 3,
  photo: "",
  reducedMotion: false,
  accent: "blue",
};
