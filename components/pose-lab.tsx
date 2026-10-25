"use client";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  ScanLine,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  initialRep,
  jointAngle,
  rules,
  trackRep,
  type RepState,
} from "@/lib/pose-math";
export default function PoseLab() {
  const video = useRef<HTMLVideoElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null),
    detector = useRef<PoseLandmarker | null>(null),
    frame = useRef(0),
    generation = useRef(0),
    state = useRef<RepState>({ ...initialRep });
  const [mode, setMode] = useState("squat"),
    [status, setStatus] = useState("idle"),
    [error, setError] = useState(""),
    [angle, setAngle] = useState<number | null>(null),
    [reps, setReps] = useState(0),
    [feedback, setFeedback] = useState("Seu próximo movimento começa aqui.");
  function stop() {
    generation.current++;
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    detector.current?.close();
    detector.current = null;
    if (video.current) video.current.srcObject = null;
    canvas.current?.getContext("2d")?.clearRect(0, 0, 1280, 720);
    setStatus("idle");
    setAngle(null);
    state.current = { ...initialRep, reps: state.current.reps };
  }
  useEffect(
    () => () => {
      generation.current++;
      cancelAnimationFrame(frame.current);
      stream.current?.getTracks().forEach((t) => t.stop());
      detector.current?.close();
    },
    [],
  );
  async function start() {
    const token = ++generation.current;
    setStatus("loading");
    setError("");
    state.current = { ...initialRep };
    setReps(0);
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw Error(
          "A câmera requer HTTPS ou localhost e um navegador compatível.",
        );
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      if (token !== generation.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      video.current!.srcObject = s;
      await video.current!.play();
      const { FilesetResolver, PoseLandmarker } =
        await import("@mediapipe/tasks-vision");
      const files = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm",
      );
      const model = await PoseLandmarker.createFromOptions(files, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numPoses: 2,
        minPoseDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65,
      });
      if (token !== generation.current) {
        model.close();
        return;
      }
      detector.current = model;
      setStatus("running");
      let last = 0;
      let side = -1;
      const loop = (time: number) => {
        if (token !== generation.current) return;
        try {
          if (time - last > 120 && video.current!.readyState >= 2) {
            last = time;
            const v = video.current!,
              c = canvas.current!;
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            const ctx = c.getContext("2d")!;
            const result = model.detectForVideo(v, time);
            const p = result.landmarks[0];
            let measured: number | null = null;
            if (p && result.landmarks.length === 1) {
              ctx.strokeStyle = "#60a5fa";
              ctx.lineWidth = 2;
              for (const e of PoseLandmarker.POSE_CONNECTIONS) {
                const a = p[e.start],
                  b = p[e.end];
                if (a.visibility > 0.65 && b.visibility > 0.65) {
                  ctx.beginPath();
                  ctx.moveTo(a.x * c.width, a.y * c.height);
                  ctx.lineTo(b.x * c.width, b.y * c.height);
                  ctx.stroke();
                }
              }
              ctx.fillStyle = "#67e8f9";
              p.forEach((a) => {
                if (a.visibility > 0.65) {
                  ctx.beginPath();
                  ctx.arc(a.x * c.width, a.y * c.height, 3, 0, Math.PI * 2);
                  ctx.fill();
                }
              });
              const triples =
                mode === "squat"
                  ? [
                      [23, 25, 27],
                      [24, 26, 28],
                    ]
                  : mode === "curl"
                    ? [
                        [11, 13, 15],
                        [12, 14, 16],
                      ]
                    : [
                        [23, 11, 13],
                        [24, 12, 14],
                      ];
              const valid = triples
                .map((t, i) => ({ t, i }))
                .filter(({ t }) => t.every((i) => p[i].visibility >= 0.75));
              const selected = valid.find((x) => x.i === side) ?? valid[0];
              if (selected) {
                if (selected.i !== side)
                  state.current = { ...initialRep, reps: state.current.reps };
                side = selected.i;
                const [a, b, d] = selected.t.map((i) => ({
                  x: p[i].x * c.width,
                  y: p[i].y * c.height,
                }));
                measured = jointAngle(a, b, d);
              }
            }
            state.current = trackRep(state.current, measured, mode);
            setAngle(measured);
            setReps(state.current.reps);
            setFeedback(
              result.landmarks.length > 1
                ? "Mantenha apenas uma pessoa no enquadramento."
                : measured === null
                  ? "Enquadre as articulações com boa iluminação."
                  : state.current.phase === "waiting"
                    ? "Assuma a posição inicial para começar."
                    : state.current.phase === "target"
                      ? "Limiar atingido. Retorne com controle."
                      : "Posição inicial reconhecida. Faça o movimento.",
            );
          }
          frame.current = requestAnimationFrame(loop);
        } catch {
          stop();
          setError(
            "A análise foi interrompida. Tente iniciar a câmera novamente.",
          );
        }
      };
      frame.current = requestAnimationFrame(loop);
    } catch (e) {
      if (token === generation.current) {
        stop();
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível acessar a câmera. Verifique a permissão.",
        );
      }
    }
  }
  const r = rules[mode];
  return (
    <div className="lab-grid">
      <div className="camera-panel">
        <div className="panel-top">
          <span>
            <ScanLine size={16} /> MOVEMENT LAB
          </span>
          <span className="pill">
            {status === "running" ? "● AO VIVO" : "CÂMERA DESLIGADA"}
          </span>
        </div>
        <div className="camera-stage">
          <video ref={video} playsInline muted />
          <canvas ref={canvas} />
          {status !== "running" && (
            <div className="camera-placeholder">
              <Camera size={42} />
              <h3>
                {status === "loading"
                  ? "Preparando o modelo…"
                  : "Transforme movimento em dados."}
              </h3>
              <p>
                {status === "loading"
                  ? "Carregando reconhecimento corporal. A primeira vez pode demorar."
                  : "Ative a câmera e posicione o corpo inteiro no enquadramento."}
              </p>
              {status === "loading" && <div className="skeleton" />}
            </div>
          )}
        </div>
        <div className="camera-bottom">
          <ShieldCheck size={16} /> Vídeo processado neste dispositivo. Nenhuma
          gravação enviada.
        </div>
      </div>
      <aside className="panel lab-controls">
        <span className="eyebrow">ANÁLISE EM TEMPO REAL</span>
        <h2>
          Cada movimento
          <br />
          tem uma história.
        </h2>
        <label>
          Exercício
          <select
            value={mode}
            disabled={status !== "idle"}
            onChange={(e) => {
              setMode(e.target.value);
              setReps(0);
              state.current = { ...initialRep };
            }}
          >
            <option value="squat">Agachamento livre</option>
            <option value="curl">Rosca direta</option>
            <option value="lateral">Elevação lateral</option>
          </select>
        </label>
        <div className="lab-numbers">
          <div>
            <strong>{reps.toString().padStart(2, "0")}</strong>
            <span>repetições</span>
          </div>
          <div>
            <strong>{angle === null ? "—" : Math.round(angle) + "°"}</strong>
            <span>{r.label.toLowerCase()}</span>
          </div>
        </div>
        <div className="feedback" role="status">
          {feedback}
        </div>
        <p className="small">
          Regra do Fitness App: posição inicial{" "}
          {r.increasing ? "abaixo" : "acima"} de {r.start}° → alvo{" "}
          {r.increasing ? "acima" : "abaixo"} de {r.target}°. Três leituras
          consecutivas por fase.
        </p>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button
          className="button primary"
          onClick={status === "idle" ? start : stop}
        >
          {status === "idle" ? <Camera size={18} /> : <CameraOff size={18} />}{" "}
          {status === "idle" ? "Ativar câmera" : "Desligar câmera"}
        </button>
        <button
          className="text-button"
          onClick={() => {
            state.current = { ...initialRep };
            setReps(0);
          }}
        >
          <RotateCcw size={14} /> Zerar contagem
        </button>
        <p className="small">
          Estimativa 2D experimental, sensível a enquadramento e perspectiva.
          Não avalia segurança da postura, não diagnostica e não substitui
          orientação profissional.
        </p>
      </aside>
    </div>
  );
}
