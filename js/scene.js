const LIME = 0xD9FF38;
const DIM  = 0x393934;
const GREY = 0x8A8A82;
let currentLens = null;

function wireMat(c, o) {
  return new THREE.LineBasicMaterial({
    color: c,
    transparent: true,
    opacity: o === undefined ? 0.85 : o
  });
}
function edges(g, c, o) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(g), wireMat(c, o));
}
function link(a, b, c, o) {
  const g = new THREE.BufferGeometry().setFromPoints([a, b]);
  return new THREE.Line(g, wireMat(c, o));
}



////////////////////////////////////////
//              Lenses
////////////////////////////////////////
function coreLens() {
  const g = new THREE.Group();
  const ico = edges(new THREE.IcosahedronGeometry(1.6, 0), LIME);
  const r1  = edges(new THREE.TorusGeometry(2.4, 0.012, 8, 80), DIM);
  r1.rotation.x = Math.PI / 2.3;

  const r2  = edges(new THREE.TorusGeometry(2.95, 0.01, 8, 80), DIM);
  r2.rotation.x = -Math.PI / 2.6;
  r2.rotation.y = 0.6;

  const dots = new THREE.Points(
    new THREE.IcosahedronGeometry(2.15, 1),
    new THREE.PointsMaterial({
      color: GREY,
      size: 0.035,
      transparent: true,
      opacity: 0.8
    })
  );

  g.add(ico, r1, r2, dots);
  g.userData.update = function(t) {
    ico.rotation.y = t * 0.25;
    ico.rotation.x = t * 0.1;
    r1.rotation.z  = t * 0.1;
    r2.rotation.z  = -t * 0.08;
  };

  return g;
}

function journalsecLens() {
  const g     = new THREE.Group();
  const outer = edges(new THREE.BoxGeometry(2.4, 2.4, 2.4), DIM);
  const mid   = edges(new THREE.BoxGeometry(1.7, 1.7, 1.7), GREY, 0.5);
  const inner = edges(new THREE.BoxGeometry(1.0, 1.0, 1.0), LIME);

  g.add(outer, mid, inner);
  const pos = new Float32Array(300);

  for (var i = 0; i < 300; i++) {
    pos[i] = (Math.random() - 0.5) * 5.5;
  };

  var pts = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({
      color: GREY,
      size: 0.03,
      transparent: true,
      opacity: 0.7
    })
  );

  g.add(pts);
  g.userData.update = function(t) {
    outer.rotation.y =  t * 0.15;
    outer.rotation.x =  t * 0.07;
    mid.rotation.y   = -t * 0.25;
    mid.rotation.x   =  t * 0.12;
    inner.rotation.y = -t * 0.45;
    inner.rotation.z =  t * 0.20;
    pts.rotation.y   =  t * 0.05;
  };

  return g;
}

function ubeLens() {
  const g = new THREE.Group()
  let laneY = [];

  for (let i = 0; i < 4; i++) {
    const y = (i - 1.5) * 0.8;
    let lane = edges(new THREE.BoxGeometry(7.4, 0.06, 0.06), (i === 1 || i === 2) ? LIME : DIM);
    lane.position.y = y;

    g.add(lane);
    laneY.push(y);
  };

  let notes = [];
  for (let j = 0; j < 24; j++) {
    const n = edges(new THREE.BoxGeometry(0.13, 0.55, 0.13), GREY, 0.7);
    n.userData.lane = j % 4;
    n.userData.off  = (j * 0.47) % 8;

    g.add(n);
    notes.push(n);
  };

  g.userData.update = function(t) {
    for (let k = 0; k < notes.length; k++) {
      const n = notes[k];
      const x = ((t * 1.7 + n.userData.off) % 8) - 4;

      n.position.set(x, laneY[n.userData.lane], 0);
      n.material.opacity = x > 2.4 ? 1 : 0.45;
    };
  };

  return g;
}

function dekiruLens() {
  const g = new THREE.Group();

  const lanes = [];
  for (let l = 0; l < 3; l++) {
    const y = (l - 1) * 1.55;

    g.add(link(new THREE.Vector3(-4.6, y, -0.7), new THREE.Vector3(4.6, y, -0.7), DIM, 0.6));

    const tiles = [];
    let n = 8 + l, total = 0, ws = [];
    for (let i = 0; i < n; i++) {
      const w = 0.35 + ((i * 37 + l  * 11) % 5) * 0.13;
      ws.push(w);
      total += w;
      const tile = edges(new THREE.BoxGeometry(w, 0.5, 0.06), (i % 4 === l) ? LIME : DIM, 0.75);
      g.add(tile);
      tiles.push(tile);
    }
    lanes.push({
      y: y,
      tiles: tiles,
      ws: ws,
      total: total,
      span: 9.2,
      speed: (l % 2 === 0 ? 1 : -1) * (0.22 + l * 0.07)
    });
  }
  const chunk  = new THREE.Group();
  const offs   = [-0.7, -0.24, 0.26, 0.74];
  const spread = [-1.6, -0.5, 0.55, 1.7];
  const pieces = [];
  for (let k = 0; k < 4; k++) {
    const pc = edges(new THREE.BoxGeometry(0.44, 0.44, 0.44), k === 0 ? LIME : GREY);
    chunk.add(pc);
    pieces.push(pc);
  }
  chunk.position.set(0, 0, 0.9);
  g.add(chunk);

  const conns = [];
  for (let c = 0; c < 3; c++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const ln = new THREE.Line(geo, wireMat(LIME, 0));
    chunk.add(ln);
    conns.push(ln);
  }

  g.userData.update = function(t) {
    for (let l = 0; l < lanes.length; l++) {
      const lane = lanes[l];
      const offset = (t * lane.speed) % lane.total;
      let acc = 0;
      for (let j = 0; j < lane.tiles.length; j++) {
        const u = (((acc + lane.ws[j] / 2 - offset) % lane.total) + lane.total) % lane.total;
        lane.tiles[j].position.set((u / lane.total) * lane.span - lane.span / 2, lane.y, -0.7);
        acc += lane.ws[j];
      }
    }
    const phase = (t * 0.35) % 2;
    let s = phase < 1 ? phase : 2 - phase;
    s = s * s * (3 - 2 * s);
    for (let k = 0; k < 4; k++) {
      pieces[k].position.x = offs[k] + (spread[k] - offs[k]) * s;
      pieces[k].material.opacity = 0.6 + s * 0.4;
    }
    for (let c = 0; c < 3; c++) {
      const posAttr = conns[c].geometry.attributes.position;
      posAttr.setXYZ(0, pieces[c].position.x, 0, 0);
      posAttr.setXYZ(1, pieces[c + 1].position.x, 0, 0);
      posAttr.needsUpdate = true;
      conns[c].material.opacity = s * 0.7;
    }
  };

  return g;
}

function desLens() {
  const g = new THREE.Group();
  const R = 8;
  const top = [];
  const bot = [];

  for (let i = 0; i < R; i++) {
    const x = (i - (R - 1) / 2) * 0.92;
    const t = edges(new THREE.BoxGeometry(0.46, 0.46, 0.46), DIM);
    t.position.set(x, 0.8, 0);

    const b = edges(new THREE.BoxGeometry(0.46, 0.46, 0.46), DIM);
    b.position.set(x, -0.8, 0);

    g.add(t, b);
    top.push(t);
    bot.push(b);

    if (i < R - 1) {
      g.add(link(new THREE.Vector3(x, 0.8, 0), new THREE.Vector3(x + 0.92, -0.8, 0), GREY, 0.35));
      g.add(link(new THREE.Vector3(x, -0.8, 0), new THREE.Vector3(x + 0.92, 0.8, 0), GREY, 0.35));
    };
  };

  const ring = new THREE.Group();
  const torus = edges(new THREE.TorusGeometry(0.85, 0.012, 8, 48), DIM);
  torus.rotation.x = Math.PI / 2.2;

  ring.add(torus);

  const keys = [];
  for (let i = 0; i < 16; i++) {
    const key = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.07), new THREE.MeshBasicMaterial({ color: GREY }));
    ring.add(key);
    keys.push(key);
  };

  ring.position.set(0, 2.45, 0);
  g.add(ring);

  var p1 = edges(new THREE.BoxGeometry(0.26, 0.26, 0.26), LIME);
  var p2 = edges(new THREE.BoxGeometry(0.26, 0.26, 0.26), LIME);
  g.add(p1, p2);

  g.userData.update = function(t) {
    const span = R - 1;
    const f = (t * 0.55) % span;
    const i = Math.min(R- 2, Math.floor(f))
    const ff = f - i;
    p1.position.lerpVectors(top[i].position, bot[i + 1].position, ff);
    p2.position.lerpVectors(bot[R - 1 - i].position, top[R - 2 - i].position, ff);

    for (let j = 0; j < R; j++) {
      const glow = Math.max(0, 1 - Math.abs(f - j) / 1.5);
      top[j].material.opacity = 0.45 + glow * 0.55;
      bot[j].material.opacity = 0.45 + glow * 0.55;
    };

    const active = Math.floor(t * 2) % 16;
    for (let k2 = 0; k2 < 16; k2++) {
      const a = (k2 / 16) * Math.PI * 2 + t * 0.6;
      keys[k2].position.set(
        Math.cos(a) * 0.85,
        Math.sin(a) * 0.85 * Math.cos(Math.PI / 2.2),
        Math.sin(a) * 0.85 * Math.sin(Math.PI / 2.2)
      );

      keys[k2].material.color.setHex(k2 === active ? LIME : GREY);
    };

    ring.rotation.y = Math.sin(t * 0.3) * 0.25;
  };

  return g;
}

function otakulogLens() {
  const g    = new THREE.Group();
  const ring = edges(new THREE.TorusGeometry(2.3, 0.01, 8, 90), DIM);
  ring.rotation.x = Math.PI / 2.4;

  const inner = edges(new THREE.TorusGeometry(1.6, 0.008, 8, 80), DIM, 0.5);
  inner.rotation.x = Math.PI / 1.8;

  const coreI = edges(new THREE.IcosahedronGeometry(0.65, 0), LIME);

  g.add(ring, inner, coreI);

  const cards = [];
  for (let i = 0; i < 10; i++) {
    const c = edges(new THREE.PlaneGeometry(0.5, 0.72), (i % 3 === 0) ? LIME : GREY, 0.9);
    c.userData.a = (i / 10) * Math.PI * 2;

    g.add(c);
    cards.push(c);
  }

  g.userData.update = function(t) {
    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];
      const a    = card.userData.a + t * 0.25;

      card.position.set(Math.cos(a) * 2.3, Math.sin(a) * 0.95, Math.sin(a) * 2.3);
      card.lookAt(0, 0, 0);
    }

    coreI.rotation.y = t * 0.5;
  };

  return g;
}

function offredLens() {
  const g    = new THREE.Group()
  const grid = new THREE.Group();

  for (let i = 0; i < 24; i++) {
    const b = edges(new THREE.BoxGeometry(0.55, 0.75, 0.55), DIM);
    b.position.set((i % 6 - 2.5) * 0.78, (Math.floor(i / 6) - 1.5) * 0.97, 0);

    grid.add(b);
  }

  g.add(grid);

  const drawer = edges(new THREE.BoxGeometry(0.55, 0.75, 0.55), LIME);
  drawer.position.set(2.5 * 0.78, -1.5 * 0.97, 0.9);

  g.add(drawer);

  g.userData.update = function (t) {
    drawer.position.z = 0.7 + 0.55 * Math.abs(Math.sin(t * 0.8));
    grid.rotation.y   = Math.sin(t * 0.2) * 0.08;
  };

  return g;
}

function toolboxLens() {
  var g        = new THREE.Group()
  const stages = [];

  for (let i = 0; i < 5; i++) {
    const s = edges(new THREE.BoxGeometry(0.7, 0.7, 0.7), (i % 2 === 0) ? LIME : DIM);
    s.position.set((i - 2) * 1.55, Math.sin(i * 2) * 0.45, 0);

    g.add(s);
    stages.push(s);
  }

  const stream = [];
  for (let j = 0; j < 8; j++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), new THREE.MeshBasicMaterial({ color: GREY }));

    g.add(p);
    stream.push(p);
  }

  g.userData.update = function(t) {
    for (let i2 = 0; i2 < stages.length; i2++) {
      stages[i2].rotation.y = t * (0.2 + i2 * 0.05);
    }

    for (let j2 = 0; j2 < stream.length; j2++) {
      const f = ((t * 0.22 + j2 / 8) % 1) * 4;
      const seg = Math.min(3, Math.floor(f));

      stream[j2].position.lerpVectors(stages[seg].position, stages[seg + 1].position, f - seg);
    }
  };

  return g;
}

function labLens() {
  const g = new THREE.Group();
  const geos = [
    new THREE.TetrahedronGeometry(0.3),
    new THREE.OctahedronGeometry(0.3),
    new THREE.BoxGeometry(0.42, 0.42, 0.42)
  ];

  for (let i = 0; i < 14; i++) {
    const m = edges(geos[i % 3], (i % 4 === 0) ? LIME : DIM);

    m.position.set((Math.random() - 0.5) * 5.2, (Math.random() - 0.5) * 3.2, (Math.random() - 0.5) * 2);
    m.userData.s  = 0.2 + Math.random() * 0.6;
    m.userData.y0 = m.position.y;
    m.userData.p  = Math.random() * 6;

    g.add(m);
  }

  g.userData.update = function(t) {
    for (let j = 0; j < g.children.length; j++) {
      const m2 = g.children[j];

      m2.rotation.x = t * m2.userData.s;
      m2.rotation.y = t * m2.userData.s * 0.7;
      m2.position.y = m2.userData.y0 + Math.sin(t * 0.8 + m2.userData.p) * 0.18;
    }
  };

  return g;
}

function skillsLens() {
  const g        = new THREE.Group();
  const C        = 5
  const clusters = [];

  for (let c = 0; c < C; c++) {
    const a = (c / C) * Math.PI * 2 - Math.PI / 2;
    const cluster = new THREE.Group();
    cluster.position.set(Math.cos(a) * 2.3, Math.sin(a) * 1.6, Math.sin(a * 2) * 0.5);

    const hub = edges(new THREE.OctahedronGeometry(0.22, 0), LIME);
    cluster.add(hub);

    const n = 9
    let pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 0.95;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.95;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.95;
    }

    const pts = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({
        color: GREY,
        size: 0.05,
        transparent: true,
        opacity: 0.9
      })
    );

    cluster.add(pts);
    cluster.userData.spin = 0.3 + Math.random() * 0.4;
    cluster.userData.hub  = hub;

    g.add(cluster); clusters.push(cluster);
    g.add(link(new THREE.Vector3(0, 0, 0), cluster.position, DIM, 0.5));
  }

  const core = edges(new THREE.IcosahedronGeometry(0.42, 0), GREY);
  g.add(core);

  g.userData.update = function(t) {
    for (let j = 0; j < clusters.length; j++) {
      const cl = clusters[j];
      cl.rotation.y = t * cl.userData.spin;
      cl.rotation.z = t * cl.userData.spin * 0.6;
      cl.userData.hub.rotation.x = t * 0.8;
    }

    core.rotation.y = t * 0.2;
  };

  return g;
}
////////////////////////////////////////
//          END OF Lenses
////////////////////////////////////////


const LENSES = {
  core:   coreLens,   journalsec: journalsecLens, ube:      ubeLens,
  des:    desLens,    dekiru:     dekiruLens,     otakulog: otakulogLens,
  offred: offredLens, toolbox:    toolboxLens,    lab:      labLens,
  skills: skillsLens
};


export function initScene(opts = {}) {
  const canvas = typeof opts.canvas === 'string'
    ? document.querySelector(opts.canvas)
    : (opts.canvas || document.getElementById('scene'));

  const THREE                = opts.THREE || window.THREE;
  const respectReducedMotion = opts.respectReducedMotion !== false;
  const initialLens          = opts.initialLens || 'core';
  const noopHandle = {
    set() {},
    destroy() {},
    available: false
  };

  if (!canvas || !THREE) {
    document.body.classList.add('no-gl');

    return noopHandle;
  }

  // renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } catch (e) {
    document.body.classList.add('no-gl');

    return noopHandle;
  }

  const reduceMotion = respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene graph
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 9);
  camera.lookAt(0,0,0);

  const root = new THREE.Group();
  scene.add(root);

  // Lens Transitions
  let current = null
  let next = null;

  function setLens(id) {
    const build = LENSES[id] || LENSES.core;
    const resolveLens = LENSES[id] ? id : 'core';
    if (next) {
      root.remove(next);
      next = null;
    }

    next = build(THREE);
    next.scale.setScalar(0.001);
    next.rotation.y = -0.6;

    root.add(next);
    currentLens = resolveLens
  }

  // Pointer & resize listeners
  let parallaxOn = true;
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e) => {
    if (!parallaxOn) return;
    pointer.x =  (e.clientX  / window.innerWidth)  * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  function resize() {
    console.log(`size:  ${window.innerWidth} - ${window.innerHeight}`);
    console.log(`pixel: ${Math.min(window.devicePixelRatio, 2)}`)
    console.log(`cam:   ${window.innerWidth / window.innerHeight}`)

    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = window.innerWidth / window.innerHeight;
    if (window.innerWidth / window.innerHeight <= 1.2) {
      camera.fov = 60
      camera.position.set(1, -1, 9);
    }

    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  // Render Loop
  const clock = new THREE.Clock();
  let rafId   = 0;
  let running = true;

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();

    if (next) {
      const s = next.scale.x + (1 - next.scale.x) * 0.08;
      next.scale.setScalar(s);
      next.rotation.y *= 0.92;

      if (current) {
        const cs = current.scale.x * 0.88;
        current.scale.setScalar(cs);

        if (cs < 0.02) {
          root.remove(current);
          current = null;
        }
      }

      if (s > 0.995) {
        current = next;
        next = null;
      }
    }

    if (!reduceMotion) {
      if (current && current.userData.update) current.userData.update(t);
      if (next && next.userData.update) next.userData.update(t);

      const tX = parallaxOn ?  pointer.x * 0.25 : 0;
      const tY = parallaxOn ? -pointer.y * 0.15 : 0;

      root.rotation.y += (tX - root.rotation.y) * 0.04;
      root.rotation.x += (tY - root.rotation.x) * 0.04;
    } else if (next && next.userData.update) {
      next.userData.update(0);
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  setLens(initialLens);
  rafId = requestAnimationFrame(tick);

  // Handle
  return {
    set: setLens,
    get: () => currentLens,
    available: true,
    setParallax: (on) => { parallaxOn = !!on },
    resize: () => resize,
    destroy() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);

      if (current)   { root.remove(current); current = null; }
      if (next)      { root.remove(next);    next = null;    }

      renderer.dispose();
      document.body.classList.remove('no-gl');
    }
  };
}
