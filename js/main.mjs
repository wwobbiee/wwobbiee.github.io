import { TIERS, SKILLS, PROJECTS, LAB } from "./data.js";
import { initScene } from "./scene.js";



const $ = (e) => document.querySelector(e);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SECTION_LENS = {
  hero:    'core',
  index:   'core',
  lab:     'lab',
  skills:  'skills',
  about:   'core',
  contact: 'core'
}

let tiltScreen  = false;
let sectionLens = 'core'
const detail    = $('#detail');
const debug     = $('#debug');



const toggleDebug = () => { debug.hidden = !debug.hidden; }
const openCmd     = () => { $('#cmdbar').hidden = false; $('#cmd-input').focus();    };
const closeCmd    = () => { $('#cmdbar').hidden = true;  $('#cmd-input').value = ''; $('#cmd-input').blur(); };
const stdout = (msg) => {
  const cmdlog = $('#cmd-log');
  const div = document.createElement('div');
  div.className = 'cmd-out';
  div.textContent = msg;

  cmdlog.appendChild(div);
  while ( cmdlog.children.length > 40 ) cmdlog.removeChild(cmdlog.firstChild);

  cmdlog.scrollTop = cmdlog.scrollHeight;
};
const VALID_COMMANDS = {
  help:   () => { stdout('commands: open <slug|n> - goto index|lab|skills|about|contact - debug - close - ls - whoami - clear'); },
  ls:     () => { stdout(PROJECTS.map(p => `${p.n} ${p.id}`).join('   ')); },
  whoami: () => { stdout('wobbie - hobbyist developer. Curious about systems, parsed daily.'); },
  clear:  () => { $('#cmd-log').innerHTML = '' },
  close:  () => {
    if (detail.classList.contains('open')) closeProject()
    else closeCmd()
  },
  goto:  (which) => {
    const to = $(`#${which}`);
    if (to) {
      to.scrollIntoView({ behavior: 'smooth' });
      stdout(`going to ${which}`);
    } else { stdout(`nothing found for '${which}' (index|lab|skills|about|contact)`); }
  },
  open: (which) => {
    let p = null;
    PROJECTS.forEach(proj => { if (proj.id === which) p = proj; });

    if (!p) {
      const n = parseInt(which, 10);
      if (n >= 1 && n <= PROJECTS.length) p = PROJECTS[n - 1];
    }

    if (p) {
      openProject(p.id);
      stdout(`opened ${p.id} - lens: ${p.lens}`);
    } else { stdout(`unknown project '${which}' (try ls)`); };
  },
  debug: () => {
    toggleDebug();
    stdout(`debug overlay: ${debug.hidden ? 'off' : 'on'}`);
  }
}
const setLensLabel = (s) => $('#d-lens').textContent = s;
const applyLens = (id) => {
  if (detail.classList.contains('open')) return;
  if (window.WOBBIES_SCENE) window.WOBBIES_SCENE.set(id);
  setLensLabel(id);
}



function openProject(id, push) {
  let p = null;
  const detailBody = $('#detail-body');
  const renderDetails = (p) => {
    detailBody.innerHTML = `
      <p class="d-kicker">${p.n} / ${p.kind}</p>
      <h2 class="d-title">${p.title}</h2>
      <p class="d-long">${p.long}</p>
      <dl class="fields">
        <dt>status</dt>
        <dd>
          <span class="status" data-status="${p.statusClass}">${p.status}</span>
        </dd>
        <dt>stack</dt>
        <dd>${p.stack.join(' &middot; ')}</dd>
        <dt>topics</dt>
        <dd>${p.topics.join(', ')}</dd>
      </dl>
      <h3 class="d-h">problem</h3>
      <p>${p.problem}</p>
      <h3 class="d-h">approach</h3>
      <p>${p.approach}</p>
      <div class="d-note">
        <strong>status note</strong>
        <p>${p.statusNote}</p>
      </div>
      ${
        p.link
          ? `<a class="d-link" href="${p.link}" rel="noopener">view source / repo &rarr;</a>`
          : '<span class="d-link d-link-off">source - private until it deserves to be public</span>'
      }
    `
  }

  PROJECTS.forEach((proj) => { if (proj.id === id) p = proj; });
  if (!p) return;

  renderDetails(p);

  detail.classList.add('open');
  detail.setAttribute('aria-hidden', 'false');

  const rows = document.querySelectorAll('.row');
  rows?.forEach((r) => { r.classList.toggle('active', r.dataset.id === id); });

  if (window.WOBBIES_SCENE && window.WOBBIES_SCENE.get() !== p.lens) window.WOBBIES_SCENE.set(p.lens);

  setLensLabel(p.lens);

  if(push !== false) history.replaceState(null, '', `#/${p.id}`);
}

function closeProject() {
  detail.classList.remove('open');
  detail.setAttribute('aria-hidden', 'true');

  const activeRow = document.querySelectorAll('.row.active');
  activeRow?.forEach((ar) => { ar.classList.remove('active'); });

  history.replaceState(null, '', location.pathname);

  applyLens(sectionLens);
}

function initProjects() {
  const rows = $('#rows');
  PROJECTS.forEach((p) => {
    const button = document.createElement('button');
    button.className = 'row';
    button.dataset.id = p.id;
    button.innerHTML = `
      <span class="num">${p.n}</span>
      <span class="row-main">
        <span class="row-title">${p.title}</span>
        <span class="row-sub">${p.long} - ${p.topics.slice(0, 3).join(', ')}</span>
      </span>
      <span class="kind">${p.kind}</span>
      <span class="status" data-status="${p.statusClass}">${p.status}</span>
    `;
    button.addEventListener('click', () => openProject(p.id));
    rows.appendChild(button);
  });
}

function initLabs() {
  const labs = $('#lab-grid');
  LAB.forEach(l => {
    const div = document.createElement('div');
    div.className = 'lab-item';
    const title = l.href
      ? `<h3><a href="${l.href}" rel="noopener">${l.title}<span class="lab-ext">&#8599;</span></a></h3>`
      : `<h3>${l.title}</h3>`;
    div.innerHTML = `<span class="lab-tag">${l.tag}</span>${title}<p>${l.desc}</p>`;
    labs.appendChild(div);
  })
}

function initSkills() {
  const root = $('#skills-root');
  if (!root || typeof SKILLS === 'undefined') return;
  const html = `
    <div class="skill-legend">
      <p class="skill-cat-label">(gdb) info skillDefinitions</p>
      ${TIERS.map(t => {
        return `
          <div class="skill-legend-row">
            <span class="skill-tier" data-tier="${t.id}">${t.name}</span>
            <p>${t.desc}</p>
          </div>
        `;
      }).join('')}
    </div>
    ${SKILLS.map(s => {
      return `
        <div class="skill-cat">
          <p class="skill-cat-label">${s.label}</p>
          <div class="skill-grid grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
          ${s.items.map(si => {
            const short = si[1].slice(0, 3);
            const long  = si[1].slice(3);
            return `
              <div class="skill-badge">
                <span class="skill-name">${si[0]}</span>
                <span class="skill-tier" data-tier="${si[1]}"><span class="xs:uppercase">${short}</span><span class="not-xs:hidden">${long}</span></span>
              </div>
            `
          }).join('')}
          </div>
        </div>
      `
    }).join('')}
  `;
  root.innerHTML = html;
}

function initPortraitParallax() {
  const portrait = $('#portrait');
  if (!portrait || reduceMotion) return;

  const CAP  = 50;
  const TILT = 20;
  const EASE = 0.10;

  let baseB = null, baseG = null;
  let curX = 0, curY = 0, tarX = 0, tarY = 0;

  const reflect = (x, cap) => {
    const p = 4 * cap;
    return Math.abs((((x - cap) % p) + p) % p - 2 * cap) - cap;
  }
  const set = (rx, ry) => {
    portrait.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    portrait.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  }

  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null) return;
    if (baseB === null) { baseB = e.beta; baseG = e.gamma; return; }

    const scale = TILT / CAP;
    tarX =  reflect(e.beta  - baseB, CAP) * scale;
    tarY = -reflect(e.gamma - baseG, CAP) * scale;
  });

  const floatLoop = () => {
    curX += (tarX - curX) * EASE;
    curY += (tarY - curY) * EASE;
    set(curX, curY);
    requestAnimationFrame(floatLoop);
  }
  floatLoop();

  // IOS 13+ orientation event
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    $('#ios-warn').classList.toggle('hidden');
    const ask = () => {
      DeviceOrientationEvent.requestPermission().catch(()=>{});
      $('#portrait').removeEventListener('touchstart', ask);
    };

    $('#portrait').addEventListener('touchstart', ask);
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = -((e.clientY / window.innerHeight) * 2 - 1);
      tarX = py * 7;
      tarY = px * 7;
    }, { passive: true });
  };
}

function handleDebugOverlay() {
  const dFps   = $('#d-fps'),   dPtr  = $('#d-ptr'), dTch = $('#d-tch'),
        dTilt  = $('#d-tilt'),  dScr  = $('#d-scr'), dHex = $('#d-hex'),
        dTrace = $('#d-trace'), dLens = $('#d-lens');

  window.addEventListener('pointermove', (e) => {
    if (debug.hidden) return;
    const cliX = e.clientX.toFixed(2);
    const cliY = e.clientY.toFixed(2);
    const disp = `${cliX.toString().padStart(5, "0")},${cliY.toString().padStart(5, "0")}`;

    dPtr.textContent = disp
    if (e.pointerType === 'touch') dTch.textContent = disp;

  }, { passive: true });

  window.addEventListener('deviceorientation', (e) => {
    if (debug.hidden || e.alpha == null) return;
    tiltScreen = true;
    dTilt = textContent [e.alpha, e.beta, e.gamma].map(v => Math.round(v)).join('/');
  });

  setTimeout(() => {
    if (!tiltScreen && !debug.hidden) dTilt.textContent = 'no gyro';
  }, 2500);

  window.addEventListener('scroll', () => {
    if (debug.hidden) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    dScr.textContent = `${pct}%`;
  }, { passive: true });

  let fps = 0
  let lastT = performance.now();
  const fpsLoop = (now) => {
    fps++;
    if (now - lastT >= 500) {
      if (!debug.hidden) dFps.textContent = Math.round(fps * 1000 / (now - lastT));
      fps = 0;
      lastT = now;
    };
    requestAnimationFrame(fpsLoop);
  }
  fpsLoop(performance.now());

  setInterval(() => {
    if (debug.hidden) return;
    let h = `0x`;
    for (var i = 0; i < 4; i++) {
      h += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    };
    dHex.textContent = h;
    dTrace.textContent = `[trace] lens=${dLens.textContent} ptr=(${dPtr.textContent || '--'}) ok`;
  }, 300);
}


function initDrawerSwipe() {
  let sX = 0, cX = 0, dragging = false, container = $('#detail');
  container.addEventListener('touchstart', (e) => {
    if (!container.classList.contains('open')) return;
    sX = e.touches[0].clientX;
    cX = 0;
    dragging = true;
    container.classList.add('dragging');
  }, { passive: true });
  container.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    cX = e.touches[0].clientX - sX;
    const dx = Math.max(0, cX);
    container.style.setProperty('--drag', `${dx}px`);
  }, { passive: true });
  container.addEventListener('touchend', (e) => {
    if (!dragging) return;
    dragging = false;
    const w = container.offsetWidth;
    const p = cX > w * 0.3;
    container.style.setProperty('--drag', '0px');
    container.classList.remove('dragging');
    if (p) closeProject();
  });
}

function initListeners() {
  initDrawerSwipe();
  $('#detail-close').addEventListener('click', closeProject);
  $('#cmd-open').addEventListener('click', () => { $('#cmdbar').hidden ? openCmd() : closeCmd(); });
  $('#cmd-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const parts = $('#cmd-input').value.trim().split(/\s+/);
      const c = parts[0]
      const rest = parts.slice(1).join(' ');

      if (c && VALID_COMMANDS[c]) VALID_COMMANDS[c](rest);
      else if (c) stdout('unknown command - try help.');

      $('#cmd-input').value = '';
    }

    if (e.key === 'Escape') closeCmd();
  })

  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement ? document.activeElement.tagName : '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA';

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#cmdbar').hidden ? openCmd() : closeCmd();

    } else if (e.key === ':' && !typing) {
      e.preventDefault();
      openCmd();

    } else {
      if (e.key === 'Escape' && detail.classList.contains('open')) {
        closeProject();
      }
    }
  });

  // Deep link: #/ube
  if (location.hash.indexOf('#/') === 0) {
    const id = location.hash.slice(2);
    PROJECTS.forEach(p => { if (p.id === id) openProject(id, false); })
  }
}

function init() {
  initProjects()
  initLabs();
  initSkills();
  
  initListeners();
  initPortraitParallax();
  handleDebugOverlay();

  window.WOBBIES_SCENE = initScene({ initialLens: 'core' });
  window.WOBBIES_SCENE.setParallax(false);
  window.WOBBIES_SCENE.resize();

  if ('IntersectionObserver' in window) {
    let mio = new IntersectionObserver((entries) => {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $('#mobile-nav').querySelectorAll('a').forEach(a => a.classList.remove('active'));
        $(`[data-loc="${e.target.id}"]`)?.classList.add('active');
      });
    }, { threshold: 0, rootMargin: '-20% 0px -60% 0px', root: null });

    let io = new IntersectionObserver((entries) => {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.35 && SECTION_LENS[e.target.id]) {
          window.WOBBIES_SCENE.setParallax(e.target.id !== 'hero');

          // Change only if different
          if (SECTION_LENS[e.target.id] === sectionLens) return;

          sectionLens = SECTION_LENS[e.target.id];
          applyLens(sectionLens);
        }
      });
    }, { threshold: [ 0.35, 0.6 ]});

    Object.keys(SECTION_LENS).forEach((id) => {
      const el = $(`#${id}`);
      if (el) {
        io.observe(el);
        mio.observe(el);
      }
    });
  };
}


window.addEventListener('load', init);