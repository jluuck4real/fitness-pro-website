"use client";
import { useEffect, useRef } from "react";
export default function BodyCloud({ reduced = false }: { reduced?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let visible = true;
    let mx = 0,
      my = 0,
      rx = 0;
    let w = 0,
      h = 0;
    const points: {
      x: number;
      y: number;
      z: number;
      ring: number;
      col: number;
    }[] = [];
    let ring = 0;
    function ellipsoid(
      cx: number,
      cy: number,
      cz: number,
      sx: number,
      sy: number,
      sz: number,
      rows: number,
    ) {
      for (let j = 1; j < rows; j++) {
        const phi = (j / rows) * Math.PI;
        const n = 32;
        for (let i = 0; i < n; i++) {
          const theta = (i / n) * Math.PI * 2;
          points.push({
            x: cx + sx * Math.sin(phi) * Math.cos(theta),
            y: cy + sy * Math.cos(phi),
            z: cz + sz * Math.sin(phi) * Math.sin(theta),
            ring: ring + j,
            col: i,
          });
        }
      }
      ring += rows;
    }
    ellipsoid(0, -1.95, 0, 0.25, 0.34, 0.25, 17);
    ellipsoid(0, -1.54, 0, 0.14, 0.18, 0.14, 8);
    ellipsoid(0, -0.95, 0, 0.58, 0.57, 0.28, 25);
    ellipsoid(0, -0.32, 0, 0.34, 0.38, 0.22, 17);
    ellipsoid(0, 0.07, 0, 0.4, 0.25, 0.25, 12);
    for (const s of [-1, 1]) {
      ellipsoid(s * 0.56, -1.22, 0, 0.21, 0.28, 0.22, 13);
      ellipsoid(s * 0.72, -0.8, 0, 0.15, 0.38, 0.16, 17);
      ellipsoid(s * 0.87, -0.21, 0.02, 0.12, 0.33, 0.12, 16);
      ellipsoid(s * 0.92, 0.2, 0.03, 0.1, 0.17, 0.09, 8);
      ellipsoid(s * 0.25, 0.65, 0, 0.22, 0.51, 0.22, 23);
      ellipsoid(s * 0.28, 1.42, 0, 0.14, 0.39, 0.15, 18);
      ellipsoid(s * 0.29, 1.9, 0.1, 0.13, 0.13, 0.27, 9);
    }
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const d = Math.min(devicePixelRatio, 2);
      canvas.width = w * d;
      canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const mouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    window.addEventListener("mousemove", mouse, { passive: true });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    function draw(t: number) {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        const still = reduced || media.matches;
        rx += (mx * 0.6 - rx) * 0.035;
        const rot = still ? -0.2 : -0.2 + rx + Math.sin(t * 0.00016) * 0.08;
        const scale = Math.min(w * 0.31, h * 0.195);
        const c = Math.cos(rot),
          s = Math.sin(rot);
        const projected = points.map((p) => {
          const x = p.x * c + p.z * s,
            z = -p.x * s + p.z * c;
          return {
            x: w * 0.52 + x * scale,
            y:
              h * 0.49 +
              (p.y + (still ? 0 : Math.sin(t * 0.0008) * 0.035) + my * 0.025) *
                scale,
            z,
            ring: p.ring,
            col: p.col,
          };
        });
        ctx.lineWidth = 0.45;
        projected.forEach((p, i) => {
          const alpha = 0.25 + (p.z + 0.4) * 0.55;
          ctx.fillStyle = `rgba(${p.z > 0.05 ? "111,211,255" : "40,111,234"},${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.z > 0.1 ? 1.45 : 0.8, 0, Math.PI * 2);
          ctx.fill();
          const next = projected[i + 1];
          if (next && next.ring === p.ring) {
            ctx.strokeStyle = `rgba(50,143,249,${alpha * 0.32})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
          const down = projected[i + 32];
          if (down && down.ring === p.ring + 1) {
            ctx.strokeStyle = "rgba(46,134,245,.11)";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(down.x, down.y);
            ctx.stroke();
          }
        });
        if (!still) {
          const scan = (Math.sin(t * 0.0005) * 0.5 + 0.5) * h;
          const glow = ctx.createLinearGradient(0, scan - 20, 0, scan + 20);
          glow.addColorStop(0, "transparent");
          glow.addColorStop(0.5, "rgba(6,182,212,.12)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(w * 0.2, scan - 20, w * 0.65, 40);
        }
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", mouse);
    };
  }, [reduced]);
  return (
    <canvas
      ref={ref}
      className="body-cloud"
      aria-label="Escultura digital tridimensional de um corpo humano em partículas azuis. Visualização artística interativa, sem análise de câmera."
      role="img"
    />
  );
}
