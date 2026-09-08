"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import styles from "./CigaretteCanvas.module.css";

const CIG_IDLE_Z   = -2.4;
const CIG_LIPS_Z   = -0.55;
const APPROACH_SPD = 1.6;
const RETREAT_SPD  = 2.2;
const NEAR_PLANE   = 0.4;
const MAX_SMK      = 200;

interface SmkParticle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number; active: boolean; idx: number;
}

export default function CigaretteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drags, setDrags] = useState(0);
  const [today, setToday] = useState(0);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [smokeBurstVisible, setSmokeBurstVisible] = useState(false);
  const [blinkVisible, setBlinkVisible] = useState(false);
  const [holdingUi, setHoldingUi] = useState(false);
  const holdMeterRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smokeBurstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MSGS = [
    "Necesitabas eso.",
    "Una más y das.",
    "El filtro ya quema.",
    "Tres en fila.",
    "La brasa no miente.",
  ];

  function showToast(msg: string) {
    setToast(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
  }

  useEffect(() => {
    const todayStr = new Date().toDateString();
    if (localStorage.getItem("cig-date") !== todayStr) {
      localStorage.setItem("cig-today", "0");
      localStorage.setItem("cig-date", todayStr);
    }
    setDrags(+(localStorage.getItem("cig-drags") || 0));
    setToday(+(localStorage.getItem("cig-today") || 0));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── State ──────────────────────────────────────────────────────
    let holding = false;
    let wasHolding = false;
    let atLips  = false;
    let dragReady = false;
    let shakeT  = 0;


    // ── Scene ──────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(0xffffff, 0.09);

    const W = canvas.clientWidth  || 400;
    const H = canvas.clientHeight || 600;

    const cam = new THREE.PerspectiveCamera(62, W / H, NEAR_PLANE, 40);
    cam.position.set(0, 0, 0);

    const ren = new THREE.WebGLRenderer({ canvas, antialias: true });
    ren.setSize(W, H, false);
    ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ren.shadowMap.enabled = true;
    ren.shadowMap.type = THREE.PCFSoftShadowMap;

    const clock = new THREE.Clock();

    // ── Lights ─────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xf0ece8, 0.75));
    const key = new THREE.DirectionalLight(0xfff8f0, 0.55);
    key.position.set(1.5, 2.5, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe8e0f0, 0.18);
    fill.position.set(-2, 1, -1);
    scene.add(fill);
    const emberLight = new THREE.PointLight(0xff5500, 1.4, 3.5);
    scene.add(emberLight);

    // ── Cigarette ──────────────────────────────────────────────────
    const cigGroup = new THREE.Group();

    const paperMat   = new THREE.MeshPhongMaterial({ color: 0xedeae0, shininess: 18 });
    const filterMat  = new THREE.MeshPhongMaterial({ color: 0xc98858, shininess: 10 });
    const bandMat    = new THREE.MeshPhongMaterial({ color: 0xc0a870, shininess: 45 });
    const tobaccoMat = new THREE.MeshLambertMaterial({ color: 0x2e1f14 });
    const ashMat     = new THREE.MeshLambertMaterial({ color: 0x9e9888 });
    const lblMat     = new THREE.MeshPhongMaterial({ color: 0xb0a898, shininess: 4 });
    const emberMat   = new THREE.MeshPhongMaterial({
      color: 0xff5500,
      emissive: new THREE.Color(0xff3300),
      emissiveIntensity: 2.2,
      shininess: 0,
    });

    function cylZ(rT: number, rB: number, h: number, seg = 18) {
      const g = new THREE.CylinderGeometry(rT, rB, h, seg);
      g.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
      return g;
    }

    cigGroup.add(new THREE.Mesh(cylZ(0.038, 0.038, 1.9), paperMat));

    const lbl = new THREE.Mesh(cylZ(0.040, 0.040, 0.36), lblMat);
    lbl.position.z = -0.18;
    cigGroup.add(lbl);

    const filt = new THREE.Mesh(cylZ(0.040, 0.040, 0.24), filterMat);
    filt.position.z = 0.95 + 0.12;
    cigGroup.add(filt);

    const ring = new THREE.Mesh(cylZ(0.041, 0.041, 0.030), bandMat);
    ring.position.z = 0.95;
    cigGroup.add(ring);

    const tob = new THREE.Mesh(cylZ(0.038, 0.038, 0.18), tobaccoMat);
    tob.position.z = -(0.95 + 0.09);
    cigGroup.add(tob);

    const ash = new THREE.Mesh(cylZ(0.036, 0.010, 0.14, 10), ashMat);
    ash.position.z = -(1.13 + 0.07);
    cigGroup.add(ash);

    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), emberMat);
    ember.position.z = -(1.13 + 0.14 + 0.022);
    cigGroup.add(ember);

    cigGroup.position.set(0.06, -0.32, CIG_IDLE_Z);
    cigGroup.rotation.set(0.22, -0.06, 0.10);
    scene.add(cigGroup);

    // ── Smoke ──────────────────────────────────────────────────────
    const smkPosArr = new Float32Array(MAX_SMK * 3).fill(-999);
    const smokeGeo  = new THREE.BufferGeometry();
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smkPosArr, 3));
    const smkMat = new THREE.PointsMaterial({
      color: 0xccc0b0, size: 0.11, transparent: true, opacity: 0.32,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    scene.add(new THREE.Points(smokeGeo, smkMat));

    const smkPool: SmkParticle[] = Array.from({ length: MAX_SMK }, (_, i) => ({
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1, active: false, idx: i,
    }));
    let smkNext = 0;

    function emitSmoke(wx: number, wy: number, wz: number, burst: boolean) {
      const n = burst ? 14 : 1;
      for (let c = 0; c < n; c++) {
        const p = smkPool[smkNext++ % MAX_SMK];
        p.active  = true;
        p.x = wx + (Math.random() - 0.5) * 0.05;
        p.y = wy + (Math.random() - 0.5) * 0.05;
        p.z = wz + (Math.random() - 0.5) * 0.05;
        p.vx = (Math.random() - 0.5) * (burst ? 0.25 : 0.05);
        p.vy = 0.05 + Math.random() * (burst ? 0.22 : 0.08);
        p.vz = burst ? -Math.random() * 0.5 : (Math.random() - 0.5) * 0.03;
        p.maxLife = burst ? 0.8 + Math.random() * 0.6 : 1.6 + Math.random() * 0.9;
        p.life = p.maxLife;
      }
    }

    function stepSmoke(dt: number, wx: number, wy: number, wz: number) {
      if (holding && Math.random() < 0.55) emitSmoke(wx, wy, wz, false);
      for (const p of smkPool) {
        if (!p.active) continue;
        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          smkPosArr[p.idx * 3 + 1] = -999;
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vx *= 1 - dt * 0.9;
        smkPosArr[p.idx * 3]     = p.x;
        smkPosArr[p.idx * 3 + 1] = p.y;
        smkPosArr[p.idx * 3 + 2] = p.z;
      }
      smokeGeo.attributes.position.needsUpdate = true;
    }

    // ── Environment ────────────────────────────────────────────────
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.MeshLambertMaterial({ color: 0xf8f6f3 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    scene.add(floor);

    const dkMat = new THREE.MeshLambertMaterial({ color: 0xeae6e0 });
    const bx1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), dkMat);
    bx1.position.set(-2.6, -1.1, -5.5);
    bx1.rotation.y = 0.6;
    scene.add(bx1);
    const bx2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), dkMat);
    bx2.position.set(2.8, -1.4, -6.0);
    bx2.rotation.y = -0.4;
    scene.add(bx2);

    // ── Render loop ────────────────────────────────────────────────
    let rafId: number;

    function loop() {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min(clock.getDelta(), 0.04);
      const t  = clock.getElapsedTime();

      const targetZ = holding ? CIG_LIPS_Z : CIG_IDLE_Z;
      const spd     = holding ? APPROACH_SPD : RETREAT_SPD;
      cigGroup.position.z += (targetZ - cigGroup.position.z) * Math.min(1, spd * dt * 2.4);

      const holdProgress = THREE.MathUtils.clamp(
        (cigGroup.position.z - CIG_IDLE_Z) / (CIG_LIPS_Z - CIG_IDLE_Z),
        0,
        1,
      );
      holdMeterRef.current?.style.setProperty("--hold-progress", String(holdProgress));

      const nearLips = cigGroup.position.z > CIG_LIPS_Z - 0.06;
      if (!atLips && holding && nearLips) {
        atLips = true;
        dragReady = true;
        shakeT = 0.22;
        emberMat.emissiveIntensity = 5;
      }

      // Store the successful reach as soon as it occurs. This prevents a mobile
      // touch release from missing the count while the cigarette begins retreating.
      if (wasHolding && !holding) {
        if (dragReady) {
          const ep = new THREE.Vector3();
          ember.getWorldPosition(ep);
          emitSmoke(ep.x, ep.y, ep.z, true);

          setDrags((prev) => {
            const next = prev + 1;
            localStorage.setItem("cig-drags", String(next));
            showToast(MSGS[(next - 1) % MSGS.length]);

            if (smokeBurstTimer.current) clearTimeout(smokeBurstTimer.current);
            setSmokeBurstVisible(false);
            requestAnimationFrame(() => setSmokeBurstVisible(true));
            smokeBurstTimer.current = setTimeout(() => setSmokeBurstVisible(false), 1350);

            if (next % 3 === 0) {
              if (blinkTimer.current) clearTimeout(blinkTimer.current);
              setBlinkVisible(true);
              blinkTimer.current = setTimeout(() => setBlinkVisible(false), 260);
            }

            return next;
          });
          setToday((prev) => {
            const next = prev + 1;
            localStorage.setItem("cig-today", String(next));
            return next;
          });
          setHintVisible(false);
        }

        atLips = false;
        dragReady = false;
      }
      wasHolding = holding;

      if (!holding) {
        cigGroup.position.y = -0.32 + Math.sin(t * 0.72) * 0.022;
        cigGroup.rotation.z = 0.10  + Math.sin(t * 0.38) * 0.013;
        cigGroup.rotation.x = 0.22  + Math.sin(t * 0.51) * 0.008;
      }
      if (holding && !atLips) {
        cigGroup.position.x = 0.06 + Math.sin(t * 9.2) * 0.004;
        cigGroup.position.y = -0.32 + Math.sin(t * 7.6) * 0.004;
      }

      const flk = 1.9 + Math.sin(t * 13.4) * 0.4 + Math.sin(t * 7.8) * 0.22 + Math.sin(t * 21.1) * 0.12;
      emberMat.emissiveIntensity = atLips ? flk * 2.2 : holding ? flk * 1.6 : flk;
      emberLight.intensity       = atLips ? flk * 2.4 : holding ? flk * 1.6 : flk * 0.8;

      const eWP = new THREE.Vector3();
      ember.getWorldPosition(eWP);
      emberLight.position.copy(eWP);
      stepSmoke(dt, eWP.x, eWP.y, eWP.z);

      if (shakeT > 0) {
        shakeT -= dt;
        const s = shakeT / 0.22;
        cam.position.x = (Math.random() - 0.5) * 0.010 * s;
        cam.position.y = (Math.random() - 0.5) * 0.007 * s;
      } else {
        cam.position.x += -cam.position.x * dt * 5;
        cam.position.y += -cam.position.y * dt * 5;
      }

      ren.render(scene, cam);
    }

    loop();

    // ── Resize ─────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      ren.setSize(w, h, false);
    });
    ro.observe(canvas);

    // ── Input ──────────────────────────────────────────────────────
    const startHold = (event?: MouseEvent | TouchEvent) => {
      if (event) {
        const point = "touches" in event ? event.touches[0] : event;
        if (point) {
          const bounds = canvas.getBoundingClientRect();
          holdMeterRef.current?.style.setProperty("--hold-x", `${point.clientX - bounds.left}px`);
          holdMeterRef.current?.style.setProperty("--hold-y", `${point.clientY - bounds.top}px`);
        }
      }
      holding = true;
      setHoldingUi(true);
    };
    const endHold = () => {
      holding = false;
      setHoldingUi(false);
    };

    canvas.addEventListener("mousedown",   startHold);
    canvas.addEventListener("mouseup",     endHold);
    canvas.addEventListener("mouseleave",  endHold);
    canvas.addEventListener("touchstart",  startHold, { passive: true });
    canvas.addEventListener("touchend",    endHold,   { passive: true });
    canvas.addEventListener("touchcancel", endHold,   { passive: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !holding) {
        e.preventDefault();
        startHold();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") endHold();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("mousedown",   startHold);
      canvas.removeEventListener("mouseup",     endHold);
      canvas.removeEventListener("mouseleave",  endHold);
      canvas.removeEventListener("touchstart",  startHold);
      canvas.removeEventListener("touchend",    endHold);
      canvas.removeEventListener("touchcancel", endHold);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (smokeBurstTimer.current) clearTimeout(smokeBurstTimer.current);
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
      ren.dispose();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Cigarrillo 3D — mantén presionado para fumar"
        role="application"
      />

      <div
        className={`${styles.smokeBurst} ${smokeBurstVisible ? styles.smokeBurstOn : ""}`}
        aria-hidden="true"
      />
      <div className={`${styles.povBlink} ${blinkVisible ? styles.povBlinkOn : ""}`} aria-hidden="true" />

      <div
        ref={holdMeterRef}
        className={`${styles.holdMeter} ${holdingUi ? styles.holdMeterOn : ""}`}
        aria-hidden="true"
      >
        <span />
      </div>

      <div className={styles.lightningStamp} aria-hidden="true">
        <svg viewBox="0 0 120 180" focusable="false">
          <path d="M71 3 17 92h35l-9 82 61-101H68z" />
          <path className={styles.lightningScratch} d="m62 13-34 70h35l-6 55 36-65H58z" />
        </svg>
      </div>

      <aside className={styles.grungeStamp} aria-label="Fumar mata, pero qué diseño">
        <span>FUMAR MATA</span>
        <small>PERO QUÉ DISEÑO</small>
        <b>×</b>
      </aside>

      <div className={styles.momStamp} aria-label="Corazón de tatuaje con la palabra mamá">
        <svg viewBox="0 0 220 190" focusable="false">
          <path
            className={styles.momHeart}
            d="M110 174C94 159 31 114 31 64c0-24 17-42 39-42 18 0 32 10 40 24 8-14 22-24 40-24 22 0 39 18 39 42 0 50-63 95-79 110Z"
          />
          <path
            className={styles.momRibbon}
            d="M9 78 49 65h122l40 13-30 19 20 25-53-13H72l-53 13 20-25Z"
          />
          <path className={styles.momRibbonFold} d="m49 65 23 44-53 13 20-25L9 78Z" />
          <path className={styles.momRibbonFold} d="m171 65-23 44 53 13-20-25 30-19Z" />
          <text x="110" y="98" textAnchor="middle">MAMÁ</text>
        </svg>
      </div>

      {/* Hint */}
      <p className={`${styles.hint} ${hintVisible ? "" : styles.hintOff}`}>
        Mantén presionado para fumar
      </p>

      {/* Stats */}
      <div className={styles.stats} aria-live="polite">
        <div className={styles.stat}>
          <span className={styles.statLbl}>Plones</span>
          <span className={`${styles.statVal} ${styles.statHi}`}>{drags}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLbl}>Hoy</span>
          <span className={styles.statVal}>{today}</span>
        </div>
      </div>

      {/* Toast */}
      <div
        className={`${styles.toast} ${toastVisible ? styles.toastOn : ""}`}
        role="status"
        aria-live="assertive"
      >
        {toast}
      </div>
    </div>
  );
}
