import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMaterials, disposeMaterials } from './materials';
import { createGeometries, disposeGeometries, buildModel, applyReveal, removeModel } from './ArchitectureModel';
import { createTweener, ease } from './tween';

/* The Spatial Stories stage: one renderer, one camera rig, one model at a
   time. Everything React needs is the handle returned by createScene(); the
   component never touches THREE objects directly.

   Quality tiers decide pixel ratio, shadow resolution, whether the hairline
   edges and the fine detail are built, and whether an environment map is
   generated for the glass. `low` is a mid-range phone.                      */
const TIERS = {
  high: { dpr: 1.75, shadow: 2048, edges: true, lite: false, env: true, aa: true },
  mid: { dpr: 1.5, shadow: 1024, edges: true, lite: false, env: true, aa: true },
  low: { dpr: 1.25, shadow: 1024, edges: false, lite: true, env: false, aa: false },
};

/* Scroll narrative. Progress 0 is the project as first framed; by 1 the
   camera has swung, risen and closed in by the project's own `camera`
   values (defaults below) and the phase-2 pieces have been set down. */
const CAMERA_DEFAULTS = {
  az: 0,
  el: 0.3,
  zoom: 1,
  ty: 3,
  radius: 12,
  swing: 0.5, // rad of azimuth over the scroll
  rise: 0.16, // rad of elevation over the scroll
  approach: 0.06, // fraction of distance closed over the scroll
};
const SUN_DEFAULT = [-15, 20, 13];
const PHASE_IN = 0.3;
const PHASE_OUT = 0.72;

const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

export function createScene(canvas, options = {}) {
  const { tier = 'high', reducedMotion = false, onSwap, onFirstFrame, onMarkers } = options;
  const q = TIERS[tier] || TIERS.high;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: q.aa,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = tier === 'low' ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  // The light never moves: the shadow map is only redrawn while the model
  // itself is changing (assembly, take-down, the scroll reveal).
  renderer.shadowMap.autoUpdate = false;
  let dpr = Math.min(window.devicePixelRatio || 1, q.dpr);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  // The near plane is close enough to stand inside a loggia or a room.
  const camera = new THREE.PerspectiveCamera(30, 1, 0.3, 320);

  let envTex = null;
  if (q.env) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();
  }

  const mats = createMaterials();
  const geos = createGeometries();

  /* ── Lighting: a soft warm sky, one low sun for long shadows, a cool rim
        from behind so the shaded faces still separate from each other. ── */
  const hemi = new THREE.HemisphereLight(0xfff6ea, 0xcbc2b4, 0.9);
  const key = new THREE.DirectionalLight(0xfff2e0, 2.6);
  key.position.set(-15, 20, 13);
  key.castShadow = true;
  key.shadow.mapSize.set(q.shadow, q.shadow);
  const sc = key.shadow.camera;
  sc.left = -21;
  sc.right = 21;
  sc.top = 21;
  sc.bottom = -21;
  sc.near = 4;
  sc.far = 70;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.035;
  const rim = new THREE.DirectionalLight(0xd9e3ee, 0.6);
  rim.position.set(16, 9, -18);
  scene.add(hemi, key, key.target, rim);

  /* ── The plinth every study sits on, and a shadow catcher under it. ── */
  const plinth = new THREE.Mesh(geos.box, mats.plinth);
  plinth.scale.set(32, 0.5, 26);
  plinth.position.y = -0.25;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  if (q.edges) plinth.add(new THREE.LineSegments(geos.boxEdges, mats.edge));
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.ShadowMaterial({ color: 0x0f243e, opacity: 0.11, transparent: true });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(plinth, ground);

  /* ── State ── */
  const tweens = createTweener();
  let model = null; // the study being shown
  let outgoing = []; // studies being taken down
  let current = null;
  let generation = 0;
  let progress = 0;
  let phaseReveal = reducedMotion ? 1 : 0;
  let shadowsDirty = true;
  let size = { w: 1, h: 1 };
  let portrait = false;

  const base = { ...CAMERA_DEFAULTS };
  const rig = { az: 0, el: 0.3, dist: 40, ty: 3, look: 3 };
  const goal = { az: 0, el: 0.3, dist: 40, ty: 3, look: 3 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let camK = 2.4; // camera smoothing rate (1/s)
  let idleT = 0;
  let snapCamera = true;

  /* ── Viewpoints: authored places to stand inside a project. `viewT`
        blends the orbit camera into the view's eye/look; while inside,
        every phase-2 piece is set down so the room is complete. ── */
  let view = null;
  let viewT = 0;
  let viewTween = null;
  const vEye = new THREE.Vector3();
  const vLook = new THREE.Vector3();
  const orbitPos = new THREE.Vector3();
  const lookAt = new THREE.Vector3();
  const VIEW_FOV = 58;
  // Looking around from a viewpoint: yaw (left/right) and pitch (up/down),
  // in radians off the authored line of sight, eased toward their targets.
  const look = { yaw: 0, pitch: 0, yawT: 0, pitchT: 0 };
  const YAW_MAX = 1.4;
  const PITCH_MAX = 0.45;
  const UP = new THREE.Vector3(0, 1, 0);
  const vDir = new THREE.Vector3();
  const vRight = new THREE.Vector3();

  /* ── Camera rig ── */
  function fitDistance(radius) {
    // Always the orbit lens: a view's wider lens must not change the orbit.
    const vf = THREE.MathUtils.degToRad(portrait ? 46 : 30);
    const hf = 2 * Math.atan(Math.tan(vf / 2) * (size.w / size.h));
    return radius / Math.sin(Math.min(vf, hf) / 2);
  }

  /* The project's framing, with its portrait overrides when the stage is
     taller than it is wide (a phone held upright). */
  function applyCamera() {
    if (!current) return;
    const c = current.camera || {};
    const { portrait: pc, ...landscape } = c;
    Object.assign(base, CAMERA_DEFAULTS, landscape, portrait && pc ? pc : {});
  }

  function applySun() {
    const s = (current && current.sun) || SUN_DEFAULT;
    key.position.set(s[0], s[1], s[2]);
    shadowsDirty = true;
  }

  function computeGoal() {
    const p = reducedMotion ? 0 : progress;
    goal.az = base.az + p * base.swing + pointer.x * 0.07 + (reducedMotion ? 0 : Math.sin(idleT * 0.32) * 0.022);
    goal.el = base.el + p * base.rise - pointer.y * 0.04 + (portrait ? 0.08 : 0);
    goal.dist = fitDistance(base.radius) * base.zoom * (1 - p * base.approach) * (portrait ? 1.06 : 1.02);
    goal.ty = base.ty;
    // Portrait leaves the lower part of the frame to the copy: look below the
    // model so it sits high. Landscape only nudges it up a little.
    const halfH = goal.dist * Math.tan(THREE.MathUtils.degToRad(portrait ? 46 : 30) / 2);
    goal.look = base.ty - halfH * (portrait ? 0.34 : 0.07);
  }

  function updateCamera(dt) {
    computeGoal();
    const k = snapCamera ? 1 : 1 - Math.exp(-dt * camK);
    snapCamera = false;
    rig.az += (goal.az - rig.az) * k;
    rig.el += (goal.el - rig.el) * k;
    rig.dist += (goal.dist - rig.dist) * k;
    rig.ty += (goal.ty - rig.ty) * k;
    rig.look += (goal.look - rig.look) * k;
    const r = rig.dist * Math.cos(rig.el);
    orbitPos.set(Math.sin(rig.az) * r, rig.ty + rig.dist * Math.sin(rig.el), Math.cos(rig.az) * r);
    lookAt.set(0, rig.look, 0);

    const baseFov = portrait ? 46 : 30;
    if (viewT > 0) {
      // Ease the blend so the move in and out reads as one camera travel.
      const s = viewT * viewT * (3 - 2 * viewT);
      camera.position.lerpVectors(orbitPos, vEye, s);
      // Where the visitor is looking: the authored line of sight, turned by
      // the look-around control, plus a small nod from the pointer.
      const lk = 1 - Math.exp(-dt * 7);
      look.yaw += (look.yawT - look.yaw) * lk;
      look.pitch += (look.pitchT - look.pitch) * lk;
      vDir.subVectors(vLook, vEye);
      vDir.applyAxisAngle(UP, look.yaw);
      vRight.crossVectors(vDir, UP).normalize();
      vDir.applyAxisAngle(vRight, look.pitch);
      vDir.add(vEye);
      lookAt.lerp(vDir, s);
      lookAt.x += pointer.x * 0.35 * s;
      lookAt.y += -pointer.y * 0.25 * s;
      const fov = baseFov + (VIEW_FOV - baseFov) * s;
      if (fov !== camera.fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    } else {
      camera.position.copy(orbitPos);
      if (camera.fov !== baseFov) {
        camera.fov = baseFov;
        camera.updateProjectionMatrix();
      }
    }
    camera.lookAt(lookAt);
  }

  /* Phase reveal: driven by the scroll, and complete while inside a view. */
  function applyPhase() {
    const r = reducedMotion ? 1 : Math.max(smoothstep(PHASE_IN, PHASE_OUT, progress), viewT);
    if (r !== phaseReveal) {
      phaseReveal = r;
      if (model) model.pieces.forEach((pc) => pc.phase === 2 && syncPiece(pc));
    }
  }

  /** Turn the head inside a view: dx yaws (left is negative), dy pitches. */
  function lookBy(dx, dy) {
    look.yawT = Math.min(Math.max(look.yawT + dx, -YAW_MAX), YAW_MAX);
    look.pitchT = Math.min(Math.max(look.pitchT + dy, -PITCH_MAX), PITCH_MAX);
    requestRender();
  }

  function setView(v) {
    if (v === view) return;
    view = v || null;
    if (v) {
      vEye.set(v.eye[0], v.eye[1], v.eye[2]);
      vLook.set(v.look[0], v.look[1], v.look[2]);
      look.yaw = 0;
      look.pitch = 0;
      look.yawT = 0;
      look.pitchT = 0;
    }
    tweens.kill(viewTween);
    const to = v ? 1 : 0;
    if (reducedMotion) {
      viewT = to;
      applyPhase();
      if (model) model.pieces.forEach((pc) => pc.anim === 'sink' && syncPiece(pc));
      requestRender();
      return;
    }
    viewTween = tweens.to({
      from: viewT,
      to,
      duration: v ? 1.5 : 1.2,
      ease: ease.inOutCubic,
      onUpdate: (x) => {
        viewT = x;
        applyPhase();
        if (model) model.pieces.forEach((pc) => pc.anim === 'sink' && syncPiece(pc));
      },
    });
    requestRender();
  }

  /* Where each viewpoint marker sits on the canvas, and whether the model
     stands between it and the camera. Reported after every frame drawn. */
  const raycaster = new THREE.Raycaster();
  const mPos = new THREE.Vector3();
  const mDir = new THREE.Vector3();
  let lastMarkerKey = '';
  function updateMarkers() {
    if (!onMarkers) return;
    const views = model && current ? current.views || [] : [];
    const list = views.map((v) => {
      mPos.set(v.at[0], v.at[1], v.at[2]);
      mDir.copy(mPos).sub(camera.position);
      const dist = mDir.length();
      raycaster.set(camera.position, mDir.normalize());
      raycaster.near = 0.1;
      raycaster.far = Math.max(dist - 0.35, 0.1);
      const occluded = raycaster.intersectObjects(model.solids, false).length > 0;
      mPos.project(camera);
      const visible = mPos.z < 1 && !occluded && viewT < 0.35 && dist > 2;
      return { id: v.id, x: Math.round((mPos.x * 0.5 + 0.5) * size.w), y: Math.round((-mPos.y * 0.5 + 0.5) * size.h), visible };
    });
    const key = list.map((m) => `${m.id}:${m.x}:${m.y}:${m.visible ? 1 : 0}`).join('|');
    if (key === lastMarkerKey) return;
    lastMarkerKey = key;
    onMarkers(list);
  }

  function updatePointer(dt) {
    const k = 1 - Math.exp(-dt * 3.5);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
  }

  /* ── Assembly / take-down ── */
  function syncPiece(pc) {
    // Phase-2 pieces come in one after another as the stage is scrolled:
    // each owns a window of the phase reveal, in the order they were
    // authored (mass first, then its openings, then the roof it carries).
    // A 'sink' piece is the other way round: it is there from the start
    // and the scroll cuts it down to its sill.
    const local = pc.phase === 2 ? smoothstep(pc.win[0], pc.win[1], phaseReveal) : 1;
    const sinking = pc.anim === 'sink';
    const target = sinking ? pc.enter : pc.enter * local;
    // Inside a view the cut walls stand back up, so the room is a room.
    const sink = sinking ? local * (1 - viewT) : 0;
    if (target !== pc.reveal || sink !== pc.sink) {
      applyReveal(pc, target, sink);
      shadowsDirty = true;
    }
  }

  function assemble(project, animate) {
    model = buildModel(project, { mats, geos, lite: q.lite, edges: q.edges });
    scene.add(model.root);
    const n = model.pieces.length;
    const stagger = Math.min(0.045, 1.1 / n);
    const secondary = model.pieces.filter((pc) => pc.phase === 2);
    secondary.forEach((pc, j) => {
      if (pc.win) return; // authored: this piece moves with its group
      const start = (j / Math.max(secondary.length, 1)) * 0.5;
      pc.win = [start, start + 0.5];
    });
    model.pieces.forEach((pc, i) => {
      if (!animate) {
        pc.enter = 1;
        syncPiece(pc);
        return;
      }
      pc.enter = 0;
      applyReveal(pc, 0);
      tweens.to({
        from: 0,
        to: 1,
        duration: 0.95,
        delay: i * stagger,
        ease: ease.outQuint,
        onUpdate: (v) => {
          pc.enter = v;
          syncPiece(pc);
        },
      });
    });
    shadowsDirty = true;
    if (onSwap) onSwap(project);
    requestRender();
  }

  function takeDown(old) {
    outgoing.push(old);
    const n = old.pieces.length;
    const stagger = Math.min(0.02, 0.5 / n);
    let longest = 0;
    old.pieces.forEach((pc, i) => {
      const delay = (n - 1 - i) * stagger;
      longest = Math.max(longest, delay + 0.42);
      tweens.to({
        from: pc.enter,
        to: 0,
        duration: 0.42,
        delay,
        ease: ease.inCubic,
        onUpdate: (v) => {
          pc.enter = v;
          syncPiece(pc);
        },
      });
    });
    return longest;
  }

  function setProject(project, { immediate = false } = {}) {
    if (current && current.id === project.id) return;
    current = project;
    applyCamera();
    applySun();
    const gen = ++generation;

    // Anything still mid-flight is settled now; the new sequence owns the stage.
    tweens.killAll();
    view = null;
    viewT = 0;
    outgoing.forEach(removeModel);
    outgoing = [];

    const first = !model;
    if (immediate || reducedMotion) {
      if (model) removeModel(model);
      snapCamera = snapCamera || first;
      assemble(project, false);
      return;
    }

    if (first) {
      snapCamera = true;
      assemble(project, true);
      return;
    }

    const old = model;
    model = null;
    const outDur = takeDown(old);
    camK = 1.6; // the swing to the next study's angle takes its time
    tweens.after(outDur * 0.7, () => {
      if (gen !== generation) return;
      removeModel(old);
      outgoing = outgoing.filter((m) => m !== old);
      assemble(project, true);
    });
    tweens.after(outDur * 0.7 + 1.4, () => {
      if (gen === generation) camK = 2.4;
    });
    requestRender();
  }

  function setProgress(p) {
    progress = Math.min(Math.max(p, 0), 1);
    applyPhase();
    requestRender();
  }

  /* ── Frame loop ── */
  let raf = 0;
  let running = false;
  let last = 0;
  let slowFrames = 0;
  let emaDt = 1 / 60;
  let started = false;
  let disposed = false;

  function frame(now) {
    raf = 0;
    if (disposed) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    idleT += dt;

    // The first frame drawn while the stage is actually on screen: the
    // component fades its elevation drawing out on this signal, so the
    // model rises out of the drawing rather than onto an empty plinth.
    if (!started && (running || reducedMotion)) {
      started = true;
      if (onFirstFrame) onFirstFrame();
    }

    const animating = tweens.update(dt);
    updatePointer(dt);
    updateCamera(dt);

    if (shadowsDirty) {
      renderer.shadowMap.needsUpdate = true;
      shadowsDirty = false;
    }
    renderer.render(scene, camera);
    updateMarkers();

    // Adaptive resolution: a machine that cannot hold ~40 fps at this pixel
    // ratio while the model is at rest gets a lower one, a step at a time,
    // rather than a stutter for the whole visit. Assembly and take-down
    // redraw the shadow map every frame and are excluded — they are brief.
    if (animating) {
      slowFrames = 0;
    } else {
      emaDt = emaDt * 0.9 + dt * 0.1;
      if (emaDt > 0.026 && dpr > 1) {
        slowFrames += 1;
        if (slowFrames > 60) {
          dpr = Math.max(1, dpr - 0.25);
          renderer.setPixelRatio(dpr);
          slowFrames = 0;
          emaDt = 1 / 60;
        }
      } else {
        slowFrames = 0;
      }
    }

    if (running) raf = requestAnimationFrame(frame);
  }

  function requestRender() {
    if (disposed) return;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function setVisible(visible) {
    if (reducedMotion) {
      if (visible) requestRender();
      return;
    }
    if (visible === running) return;
    running = visible;
    if (visible) {
      last = 0;
      requestRender();
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function resize(w, h) {
    if (w < 2 || h < 2) return;
    size = { w, h };
    const wasPortrait = portrait;
    portrait = h > w;
    if (portrait !== wasPortrait) applyCamera();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    requestRender();
  }

  function setPointer(x, y) {
    pointer.tx = Math.min(Math.max(x, -1), 1);
    pointer.ty = Math.min(Math.max(y, -1), 1);
    requestRender();
  }

  function dispose() {
    // Nothing may draw after this: the context is about to be lost and
    // three would try to compile programs against it (null uniform info).
    disposed = true;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    tweens.killAll();
    if (model) removeModel(model);
    outgoing.forEach(removeModel);
    disposeGeometries(geos);
    disposeMaterials(mats);
    groundGeo.dispose();
    groundMat.dispose();
    if (envTex) envTex.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    setProject,
    setProgress,
    setView,
    lookBy,
    setPointer,
    setVisible,
    resize,
    dispose,
    /** Diagnostics for the verification pass. */
    get info() {
      return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, dpr };
    },
  };
}
