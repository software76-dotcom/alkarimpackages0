
// Isolated More Packages gallery: one lazy renderer, six scissored product views.
import * as THREE from '@alkarim/vendor/build/three.module.js';
import { RoundedBoxGeometry } from '@alkarim/vendor/examples/jsm/geometries/RoundedBoxGeometry.js';

const section = document.getElementById('packages');
const slots = [...section.querySelectorAll('.pkg-visual')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer, views = [], frame = 0, previous = 0, elapsed = 0, visible = false, failed = false;
let width = 0, height = 0, enteringUntil = 0;
const pointer = { x: 0, y: 0, index: -1 };
const paused = () => reduced.matches || document.getElementById('motion')?.getAttribute('aria-pressed') === 'true';

function paperTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d'), pixels = ctx.createImageData(128, 128);
  let seed = 17;
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const n = 175 + (seed >>> 26);
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = n; pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  return t;
}

function initialize() {
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.domElement.className = 'pkg-renderer'; renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false;
    section.appendChild(renderer.domElement);
    const grain = paperTexture();
    const material = (color, roughness = .72, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness, bumpMap: grain, bumpScale: .008 });
    const mat = {
      bone: material('#e8ddc1'), inner: material('#c4b89b'), dark: material('#272d23'),
      gold: material('#bd873e', .3, .7), amber: material('#b8792e'), kraft: material('#a87c49'),
      edge: material('#654f32'), foam: material('#171d16'), tape: material('#c09b68', .5),
    };
    // Shared studio reflections; generated locally, without image downloads.
    const envScene = new THREE.Scene(); envScene.background = new THREE.Color('#494b42');
    const softbox = (x, y, z, sx, sy, color, intensity) => {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
      panel.position.set(x, y, z); panel.lookAt(0, 0, 0); envScene.add(panel);
    };
    softbox(-4, 4, 3, 4, 6, '#fff2da', 3); softbox(4, 2, -3, 2, 5, '#e8a33d', 2);
    softbox(1, 5, 1, 3, 3, '#ffffff', 2);
    const pmrem = new THREE.PMREMGenerator(renderer), environment = pmrem.fromScene(envScene, .12, .1, 30);
    pmrem.dispose(); envScene.traverse(o => { o.geometry?.dispose(); if (o.material) o.material.dispose(); });
    const unit = new RoundedBoxGeometry(1, 1, 1, 2, .018);
    const block = (parent, w, h, d, x, y, z, m) => {
      const mesh = new THREE.Mesh(unit, m); mesh.scale.set(w, h, d); mesh.position.set(x, y, z);
      mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };
    const tray = (parent, w, h, d, m, lining = mat.inner, thick = .07) => {
      const group = new THREE.Group(); parent.add(group);
      block(group, w, thick, d, 0, thick / 2, 0, m);
      block(group, w - thick * 2, .015, d - thick * 2, 0, thick + .008, 0, lining);
      block(group, w, h, thick, 0, h / 2, (d - thick) / 2, m);
      block(group, w, h, thick, 0, h / 2, -(d - thick) / 2, m);
      block(group, thick, h, d - thick * 2, -(w - thick) / 2, h / 2, 0, m);
      block(group, thick, h, d - thick * 2, (w - thick) / 2, h / 2, 0, m);
      return group;
    };
    const stampCache = new Map();
    const stamp = (parent, y, z = 0, size = 1.15, front = false) => {
      const key = front ? 'front' : 'top';
      if (!stampCache.has(key)) {
        const c = document.createElement('canvas'); c.width = 512; c.height = 256;
        const ctx = c.getContext('2d'); ctx.fillStyle = '#d4a758'; ctx.textAlign = 'center';
        ctx.font = '600 70px Arial'; ctx.fillText('ALKARIM', 256, 130);
        ctx.font = '24px Arial'; ctx.fillText('P A C K A G E S', 256, 174);
        ctx.strokeStyle = '#d4a758'; ctx.lineWidth = 2; ctx.strokeRect(34, 55, 444, 152);
        const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace;
        stampCache.set(key, new THREE.MeshStandardMaterial({ map, transparent: true, metalness: .45, roughness: .4, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
      }
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size / 2), stampCache.get(key));
      mesh.position.set(0, y, z); if (!front) mesh.rotation.x = -Math.PI / 2;
      parent.add(mesh); return mesh;
    };
    views = slots.map((slot, i) => {
      const scene = new THREE.Scene(); scene.environment = environment.texture;
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 30);
      camera.position.set(3.9, 3.25, 5.7); camera.lookAt(0, .85, 0);
      scene.add(new THREE.HemisphereLight('#fff2db', '#2b3028', 2));
      const key = new THREE.DirectionalLight('#fff1d9', 3.7); key.position.set(-3, 6, 4);
      key.castShadow = true; key.shadow.mapSize.set(512, 512); key.shadow.camera.left = -3; key.shadow.camera.right = 3;
      key.shadow.camera.top = 4; key.shadow.camera.bottom = -3; key.shadow.camera.far = 16;
      key.shadow.normalBias = .035; key.shadow.bias = -.0003; scene.add(key);
      const rim = new THREE.DirectionalLight('#e8a33d', 2); rim.position.set(3, 3, -4); scene.add(rim);
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .3 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -.03; ground.receiveShadow = true; scene.add(ground);
      const root = new THREE.Group(); scene.add(root);
      const moving = [];
      if (i === 0) {
        // Deep rigid gift box with a separately wrapped lift-off lid.
        tray(root, 2.18, .88, 1.7, mat.dark, mat.bone);
        [-1, 1].forEach(sign => {
          block(root, 2.19, .018, .075, 0, .865, sign * .815, mat.gold);
          block(root, .075, .018, 1.55, sign * 1.055, .865, 0, mat.gold);
        });
        const lid = tray(root, 2.29, .27, 1.81, mat.bone, mat.inner);
        lid.rotation.z = Math.PI; lid.position.y = 1.45;
        stamp(lid, -.007, 0, 1.25); lid.children.at(-1).rotation.x = Math.PI / 2;
        moving.push(t => { lid.position.y = 1.4 + .15 * Math.sin(t * .8); lid.rotation.y = .035 * Math.sin(t * .6); });
      } else if (i === 1) {
        // Book-style magnetic case, with an articulated lid and closure flap.
        tray(root, 2.25, .62, 1.65, mat.dark, mat.bone);
        block(root, 2.1, .12, 1.5, 0, .15, 0, mat.foam);
        const hinge = new THREE.Group(); hinge.position.set(0, .62, -.83); root.add(hinge);
        block(hinge, 2.29, .075, 1.73, 0, 0, .865, mat.dark);
        block(hinge, 2.11, .018, 1.52, 0, -.048, .84, mat.inner);
        stamp(hinge, .044, .87, 1.22);
        const flap = block(hinge, 2.29, .33, .07, 0, -.15, 1.69, mat.dark);
        block(flap, .23 / 2.29, .05 / .33, 1.1, 0, -.02, .02, mat.gold);
        moving.push(t => { hinge.rotation.x = -1.0 + .15 * Math.sin(t * .65); });
      } else if (i === 2) {
        // Open-ended sleeve and sliding presentation tray with a ribbon pull.
        block(root, 2.16, .075, 1.66, 0, .05, -.14, mat.bone);
        block(root, 2.16, .075, 1.66, 0, .82, -.14, mat.bone);
        block(root, .075, .77, 1.66, -1.04, .435, -.14, mat.bone);
        block(root, .075, .77, 1.66, 1.04, .435, -.14, mat.bone);
        stamp(root, .861, -.14, 1.3);
        const drawer = tray(root, 1.98, .61, 1.52, mat.amber, mat.dark); drawer.position.y = .095;
        const ribbon = block(drawer, .22, .035, .4, 0, .33, .9, mat.gold); ribbon.rotation.x = .22;
        moving.push(t => { drawer.position.z = .47 + .16 * Math.sin(t * .75); });
      } else if (i === 3) {
        // Tall retail carton, thin board, open tuck flap and folded dust tabs.
        tray(root, 1.38, 1.82, 1.02, mat.bone, mat.inner, .035);
        block(root, 1.4, .26, .025, 0, .32, .515, mat.amber);
        stamp(root, 1.1, .532, 1.02, true);
        const top = new THREE.Group(); top.position.set(0, 1.82, -.5); root.add(top);
        block(top, 1.36, .027, 1.02, 0, 0, .51, mat.bone);
        const tongue = block(top, 1.16, .025, .29, 0, -.05, 1.13, mat.bone); tongue.rotation.x = -.3;
        [-1, 1].forEach(sign => { const tab = block(root, .36, .025, .92, sign * .51, 1.76, 0, mat.inner); tab.rotation.z = sign * .32; });
        moving.push(t => { top.rotation.x = -.8 + .12 * Math.sin(t * .6); });
      } else if (i === 4) {
        // Low self-locking mailer with fold-over side walls and front tabs.
        tray(root, 2.32, .48, 1.62, mat.kraft, mat.inner, .06);
        [-1, 1].forEach(sign => block(root, .11, .4, 1.45, sign * 1.03, .24, 0, mat.kraft));
        const hinge = new THREE.Group(); hinge.position.set(0, .48, -.81); root.add(hinge);
        block(hinge, 2.3, .048, 1.64, 0, 0, .82, mat.kraft);
        block(hinge, 2.06, .015, 1.4, 0, -.034, .8, mat.bone);
        const logo = stamp(hinge, -.045, .82, 1.2); logo.rotation.x = Math.PI / 2;
        [-1, 1].forEach(sign => { const tab = block(hinge, .23, .043, .48, sign * 1.13, -.15, 1.43, mat.kraft); tab.rotation.z = sign * .8; });
        block(hinge, 1.95, .26, .045, 0, -.12, 1.62, mat.kraft);
        moving.push(t => { hinge.rotation.x = -1.48 + .09 * Math.sin(t * .65); });
      } else {
        // Corrugated transit box with four independent flaps and exposed fluting.
        tray(root, 1.85, 1.3, 1.5, mat.kraft, mat.edge, .055);
        const flaps = [];
        [-1, 1].forEach(sign => {
          const hinge = new THREE.Group(); hinge.position.set(0, 1.3, sign * .75); root.add(hinge);
          block(hinge, 1.85, .038, .73, 0, 0, sign * .365, mat.kraft);
          block(hinge, .32, .004, .7, 0, .022, sign * .365, mat.tape);
          flaps.push({ hinge, sign, axis: 'x' });
          const side = new THREE.Group(); side.position.set(sign * .925, 1.3, 0); root.add(side);
          block(side, .67, .038, 1.48, sign * .335, 0, 0, mat.kraft);
          flaps.push({ hinge: side, sign, axis: 'z' });
        });
        const lines = new THREE.InstancedMesh(new THREE.BoxGeometry(.013, .038, .04), mat.edge, 38);
        const matrix = new THREE.Matrix4();
        for (let j = 0; j < 38; j++) { matrix.makeTranslation(-.88 + j * .047, 1.29, .73); lines.setMatrixAt(j, matrix); }
        root.add(lines);
        stamp(root, .7, .78, 1.06, true);
        block(root, .32, .4, .006, 0, .2, .78, mat.tape);
        moving.push(t => flaps.forEach(({ hinge, sign, axis }) => { hinge.rotation[axis] = sign * (axis === 'x' ? -.43 : .3) + Math.sin(t * .55) * .035; }));
      }
      return { slot, scene, camera, root, moving, hoverX: 0, hoverY: 0, base: i === 3 ? -.15 : -.25 };
    });
    section.classList.add('pkg-3d-ready');
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); failed = true; section.classList.remove('pkg-3d-ready'); cancelAnimationFrame(frame); frame = 0; renderer.domElement.hidden = true; });
  } catch (error) {
    failed = true; renderer?.dispose(); renderer?.domElement.remove();
    section.classList.remove('pkg-3d-ready');
  }
}

function wake() {
  if (!frame && visible && !failed && !document.hidden) frame = requestAnimationFrame(render);
}
function render(now) {
  frame = 0;
  if (!visible || failed || document.hidden) return;
  if (!renderer) initialize();
  if (failed) return;
  const dt = Math.min(.05, (now - previous) / 1000 || .016); previous = now;
  const still = paused(); if (!still) elapsed += dt;
  if (width !== section.clientWidth || height !== innerHeight) {
    width = section.clientWidth; height = innerHeight; renderer.setSize(width, height);
  }
  // All layout reads precede canvas writes; only visible product windows are drawn.
  const rects = views.map(v => v.slot.getBoundingClientRect());
  const sectionRect = section.getBoundingClientRect();
  const canvasOffset = Math.max(0, Math.min(-sectionRect.top - section.clientTop, Math.max(0, section.clientHeight - height)));
  const canvasTop = sectionRect.top + section.clientTop + canvasOffset;
  const canvasLeft = sectionRect.left + section.clientLeft;
  renderer.domElement.style.transform = 'translate3d(0,' + canvasOffset + 'px,0)';

  renderer.setScissorTest(false); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.setScissorTest(true);
  let count = 0;
  views.forEach((v, i) => {
    const r = rects[i]; if (r.bottom <= 0 || r.top >= height || r.width <= 0) return;
    count++;
    const blend = still ? 1 : 1 - Math.exp(-dt * 6);
    v.hoverX += ((pointer.index === i && !still ? pointer.x * .12 : 0) - v.hoverX) * blend;
    v.hoverY += ((pointer.index === i && !still ? pointer.y * .06 : 0) - v.hoverY) * blend;
    const t = still ? 1.2 : elapsed + i * .8;
    v.root.rotation.y = v.base + (still ? 0 : Math.sin(t * .3) * .09) + v.hoverX;
    v.root.rotation.x = v.hoverY; v.moving.forEach(update => update(t));
    v.camera.aspect = r.width / r.height; v.camera.updateProjectionMatrix();
    // Package canvas coordinates follow its section.
    const left = r.left - canvasLeft, bottom = height - (r.bottom - canvasTop);
    renderer.setViewport(left, bottom, r.width, r.height);
    renderer.setScissor(Math.max(0, left), Math.max(0, bottom), Math.max(0, Math.min(width, left + r.width) - Math.max(0, left)), Math.max(0, Math.min(height, bottom + r.height) - Math.max(0, bottom)));
    renderer.render(v.scene, v.camera);
  });
  renderer.domElement.hidden = count === 0;
  section.dataset.packageMotion = still ? 'reduced' : count ? 'running' : 'idle';
  if ((!still && count) || now < enteringUntil) frame = requestAnimationFrame(render);
}

const observer = new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  if (visible) { enteringUntil = performance.now() + 1250; previous = performance.now(); wake(); }
  else { cancelAnimationFrame(frame); frame = 0; if (renderer) renderer.domElement.hidden = true; section.dataset.packageMotion = 'idle'; }
}, { rootMargin: '100px 0px' });
observer.observe(section);
window.addEventListener('scroll', wake, { passive: true });
window.addEventListener('resize', wake, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; section.dataset.packageMotion = 'idle'; }
  else { previous = performance.now(); wake(); }
});
reduced.addEventListener('change', wake);
document.addEventListener('click', event => { if (event.target.closest('#motion')) wake(); });
slots.forEach((slot, i) => {
  slot.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const rect = slot.getBoundingClientRect(); pointer.index = i;
    pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1; pointer.y = (event.clientY - rect.top) / rect.height * 2 - 1; wake();
  }, { passive: true });
  slot.addEventListener('pointerleave', () => { pointer.index = -1; wake(); }, { passive: true });
});

