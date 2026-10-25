import test from "node:test";
import assert from "node:assert/strict";
import { jointAngle, initialRep, trackRep } from "../lib/pose-math.ts";
test("ângulos retos, extensão e pontos coincidentes", () => {
  assert.equal(jointAngle({ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }), 90);
  assert.equal(
    jointAngle({ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }),
    180,
  );
  assert.equal(
    jointAngle({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }),
    null,
  );
});
function sequence(mode, values) {
  return values.reduce((s, v) => trackRep(s, v, mode), { ...initialRep });
}
test("exige posição inicial estável e três leituras no alvo", () => {
  assert.equal(sequence("squat", [80, 80, 80, 80]).reps, 0);
  assert.equal(sequence("squat", [170, 170, 170, 80, 80]).reps, 0);
  assert.equal(sequence("squat", [170, 170, 170, 80, 80, 80, 80, 80]).reps, 1);
});
test("conta duas repetições apenas após rearmar", () => {
  assert.equal(
    sequence("curl", [170, 170, 170, 40, 40, 40, 170, 170, 170, 40, 40, 40])
      .reps,
    2,
  );
});
test("perda de rastreio desarma e ruído não conta", () => {
  assert.equal(
    sequence("squat", [170, 170, 170, 80, null, 80, 80, 80]).reps,
    0,
  );
  assert.equal(
    sequence("squat", [170, 170, 170, 80, 110, 80, 110, 80]).reps,
    0,
  );
});
test("elevação lateral mede um ângulo crescente", () => {
  assert.equal(sequence("lateral", [20, 20, 20, 100, 100, 100]).reps, 1);
});
