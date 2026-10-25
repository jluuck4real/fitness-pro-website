export type Point = { x: number; y: number; z?: number; visibility?: number };
export function jointAngle(a: Point, b: Point, c: Point) {
  const u = { x: a.x - b.x, y: a.y - b.y },
    v = { x: c.x - b.x, y: c.y - b.y };
  const length = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  if (length < 1e-8) return null;
  return (
    (Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / length))) *
      180) /
    Math.PI
  );
}
export type RepState = {
  phase: "waiting" | "ready" | "target";
  reps: number;
  stable: number;
  candidate: boolean | null;
  armed: boolean;
};
export const initialRep: RepState = {
  phase: "waiting",
  reps: 0,
  stable: 0,
  candidate: null,
  armed: false,
};
export const rules: Record<
  string,
  { start: number; target: number; increasing: boolean; label: string }
> = {
  squat: { start: 160, target: 90, increasing: false, label: "Joelho" },
  curl: { start: 160, target: 50, increasing: false, label: "Cotovelo" },
  lateral: { start: 40, target: 90, increasing: true, label: "Ombro" },
};
export function trackRep(
  state: RepState,
  angle: number | null,
  mode: string,
): RepState {
  if (angle === null || !Number.isFinite(angle) || angle < 0 || angle > 180)
    return { ...initialRep, reps: state.reps };
  const r = rules[mode];
  const ready = r.increasing ? angle < r.start : angle > r.start;
  const target = r.increasing ? angle > r.target : angle < r.target;
  if (!ready && !target) return { ...state, stable: 0, candidate: null };
  const stable = state.candidate === target ? state.stable + 1 : 1;
  if (stable >= 3 && ready)
    return { ...state, stable, candidate: target, phase: "ready", armed: true };
  if (stable >= 3 && target && state.armed)
    return {
      ...state,
      stable,
      candidate: target,
      phase: "target",
      armed: false,
      reps: state.reps + 1,
    };
  return { ...state, stable, candidate: target };
}
