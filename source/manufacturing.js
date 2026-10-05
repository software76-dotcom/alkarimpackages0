// Manufacturing gallery is self-contained; existing scenes and controls are untouched.
import * as THREE from '@alkarim/vendor/build/three.module.js';
import { RoundedBoxGeometry } from '@alkarim/vendor/examples/jsm/geometries/RoundedBoxGeometry.js';

const section = document.getElementById('manufacturing');
const slots = [...section.querySelectorAll('.machine-visual')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reduced.matches || document.getElementById('motion')?.getAttribute('aria-pressed') === 'true' || section.querySelector('#machine-pause').getAttribute('aria-pressed') === 'true';
let renderer, views = [], visible = false, frame = 0, time = 0, previous = 0, width = 0, height = 0, failed = false;
let pointerIndex = -1, pointerX = 0, pointerY = 0;

function initialize() {
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false; renderer.domElement.className = 'machine-renderer';
    renderer.domElement.setAttribute('aria-hidden', 'true'); section.appendChild(renderer.domElement);
    const env = new THREE.Scene(); env.background = new THREE.Color('#484b46');
    function softbox(x,y,z,w,h,color,intensity) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));
      p.position.set(x,y,z); p.lookAt(0,0,0); env.add(p);
    }
    softbox(-4,5,4,4,6,'#fff4df',3); softbox(5,3,-3,2,5,'#e8a33d',3); softbox(2,6,0,3,3,'#ffffff',2);
    const generator = new THREE.PMREMGenerator(renderer), environment = generator.fromScene(env,.06,.1,30);
    generator.dispose(); env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
    const ctx=canvas.getContext('2d'), pixels=ctx.createImageData(128,128);let seed=31;
    for(let i=0;i<pixels.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const c=170+(seed>>>27);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=c;pixels.data[i+3]=255;}
    ctx.putImageData(pixels,0,0); const grain=new THREE.CanvasTexture(canvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(4,4);
    const material=(color,metalness=.55,roughness=.4)=>new THREE.MeshStandardMaterial({color,metalness,roughness,bumpMap:grain,bumpScale:.004});
    const m={body:material('#343d35'),edge:material('#1b241f'),steel:material('#c1c6bc',.92,.26),darkSteel:material('#616c66',.82,.36),gold:material('#b9843b',.8,.32),bone:material('#d6d2bd',.3,.52),rubber:material('#181b17',.02,.85),paper:material('#cfb487',0,.92),black:material('#0f130f',.2,.7),red:material('#92432a',.05,.55),green:new THREE.MeshStandardMaterial({color:'#b7c695',emissive:'#8a9e64',emissiveIntensity:.45})};
    const boxGeo=new RoundedBoxGeometry(1,1,1,2,.018), cylinderGeo=new THREE.CylinderGeometry(1,1,1,32), boltGeo=new THREE.CylinderGeometry(1,1,1,6);
    function box(parent,w,h,d,x,y,z,mat=m.body){const o=new THREE.Mesh(boxGeo,mat);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
    function cylinder(parent,r,length,x,y,z,mat=m.steel,axis='x'){const o=new THREE.Mesh(cylinderGeo,mat);o.scale.set(r,length,r);o.position.set(x,y,z);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
    function rod(parent,a,b,r=.035,mat=m.steel){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b),o=new THREE.Mesh(cylinderGeo,mat);o.position.copy(p).add(q).multiplyScalar(.5);o.scale.set(r,p.distanceTo(q),r);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q.sub(p).normalize());o.castShadow=true;parent.add(o);return o;}
    function bolts(parent,points){const o=new THREE.InstancedMesh(boltGeo,m.steel,points.length),dummy=new THREE.Object3D();points.forEach((p,i)=>{dummy.position.set(...p);dummy.rotation.set(Math.PI/2,0,0);dummy.scale.set(.031,.018,.031);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix);});parent.add(o);}
    function roller(parent,y,z,r=.18,length=2.65,mat=m.steel){const group=new THREE.Group();group.position.set(0,y,z);parent.add(group);cylinder(group,r,length,0,0,0,mat);cylinder(group,.075,length+.38,0,0,0,m.darkSteel);[-1,1].forEach(s=>{cylinder(group,r*1.025,.07,s*(length/2-.045),0,0,m.gold);});box(group,.022,r*.02,length*.02,0,r+.002,0,m.darkSteel);return group;}
    function motor(parent,x,y,z){cylinder(parent,.27,.58,x,y,z,m.darkSteel);for(let j=0;j<6;j++)cylinder(parent,.285,.025,x-.25+j*.095,y,z,m.edge);box(parent,.6,.1,.5,x,y-.27,z,m.edge);}
    function panel(parent,x,y,z){box(parent,.37,.55,.13,x,y,z,m.bone);box(parent,.25,.12,.012,x,y+.14,z+.072,m.black);[-.09,0,.09].forEach((dx,j)=>cylinder(parent,.026,.018,x+dx,y-.02,z+.079,j===0?m.red:j===1?m.green:m.gold,'z'));cylinder(parent,.058,.03,x,y-.16,z+.08,m.red,'z');}
    const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=128;
    const labelCtx=labelCanvas.getContext('2d');labelCtx.fillStyle='#d6d2bd';labelCtx.fillRect(0,0,512,128);labelCtx.fillStyle='#252c24';labelCtx.textAlign='center';labelCtx.font='bold 46px Arial';labelCtx.fillText('ALKARIM',256,58);labelCtx.font='18px Arial';labelCtx.fillText('P A C K A G E S',256,97);
    const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
    const labelMaterial=new THREE.MeshStandardMaterial({map:labelTexture,roughness:.55,metalness:.15});
    function label(parent,x,y,z,w=.65){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),labelMaterial);p.position.set(x,y,z);parent.add(p);}
    function wheel(parent,x,y,z,r=.55){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=Math.PI/2;parent.add(g);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.055,8,36),m.darkSteel);ring.castShadow=true;g.add(ring);
      cylinder(g,.13,.17,0,0,0,m.gold,'z');for(let j=0;j<6;j++){const a=j*Math.PI/3;rod(g,[.08*Math.cos(a),.08*Math.sin(a),0],[r*Math.cos(a),r*Math.sin(a),0],.032,m.darkSteel);}return g;}
    function table(parent,w,d,y,z,mat=m.darkSteel){box(parent,w,.09,d,0,y,z,mat);[-1,1].forEach(s=>{box(parent,.1,y-.12,.1,s*(w/2-.1),y/2,z+d/2-.12,m.body);});}

    views=slots.map((slot,index)=>{
      const scene=new THREE.Scene();scene.environment=environment.texture;
      const camera=new THREE.PerspectiveCamera(33,1,.1,40);camera.position.set(5.8,4.15,7.5);camera.lookAt(0,1.15,.1);
      scene.add(new THREE.HemisphereLight('#f6efdc','#20291e',1.7));
      const key=new THREE.DirectionalLight('#fff2dc',3.5);key.position.set(-3,6,4);key.castShadow=true;key.shadow.mapSize.set(512,512);Object.assign(key.shadow.camera,{left:-4,right:4,top:5,bottom:-4,far:18});key.shadow.normalBias=.025;scene.add(key);
      const rim=new THREE.DirectionalLight('#e8a33d',2.8);rim.position.set(4,3,-4);scene.add(rim);
      const fill=new THREE.DirectionalLight('#ccd4d0',1.2);fill.position.set(4,2,4);scene.add(fill);
      const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.26}));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;ground.receiveShadow=true;scene.add(ground);
      const root=new THREE.Group();scene.add(root);box(root,4.15,.13,4.15,0,-.08,.15,m.black);
      [-1,1].forEach(s=>box(root,.025,.012,.6,s*1.94,-.008,1.81,m.gold));
      const motion=[];
      if(index===0){
        // Roller sheet-pasting machine: side housings, nip rollers and projecting feed table.
        [-1,1].forEach(s=>{box(root,.4,1.7,1.08,s*1.45,.92,-.48,m.body);box(root,.53,.12,1.25,s*1.45,.08,-.45,m.edge);cylinder(root,.32,.42,s*1.45,1.73,-.5,m.body);box(root,.12,.72,.065,s*1.23,1.56,.07,m.gold);});
        box(root,2.75,.22,.72,0,.32,-.52,m.edge);box(root,2.6,.12,.7,0,1.2,-.35,m.darkSteel);
        const r1=roller(root,1.58,-.38,.235),r2=roller(root,1.2,-.28,.13),r3=roller(root,1.63,-.75,.18,2.65,m.rubber);
        box(root,2.72,.09,.22,0,1.95,-.43,m.body);box(root,2.64,.035,.035,0,1.88,-.3,m.gold);
        table(root,2.9,1.8,1.12,1.03);[-1,1].forEach(s=>rod(root,[s*1.32,1.2,.08],[s*1.32,1.2,1.8],.019));
        const sheet=box(root,1.94,.018,1.3,0,1.18,.73,m.paper);
        box(root,.4,.85,.45,-1.58,.45,1.43,m.body);panel(root,-1.58,.95,1.65);motor(root,1.5,.58,-.48);
        wheel(root,-1.75,1.63,-.38,.19);bolts(root,[[-1.45,.35,.071],[-1.45,1.25,.071],[1.45,.35,.071],[1.45,1.25,.071]]);label(root,0,.35,-.148,.84);
        motion.push(t=>{r1.rotation.x=t*.4;r2.rotation.x=-t*.7;r3.rotation.x=t*.5;sheet.position.z=.68+Math.sin(t*.55)*.15;});
      }else if(index===1){
        // Inclined single-facer silhouette and exposed metallic corrugating rollers.
        [-1,1].forEach(s=>{
          const shape=new THREE.Shape();shape.moveTo(-1.1,.12);shape.lineTo(1.22,.12);shape.lineTo(1.14,.8);shape.lineTo(-.57,2.42);shape.lineTo(-1.12,2.42);shape.closePath();
          const geometry=new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.025});
          const side=new THREE.Mesh(geometry,m.body);side.rotation.y=-Math.PI/2;side.position.x=s*1.39;side.castShadow=side.receiveShadow=true;root.add(side);
          rod(root,[s*1.27,.4,1.15],[s*1.27,2.48,-.65],.065,m.gold);
          rod(root,[s*1.38,2.1,-.92],[s*1.38,3.02,-.92],.045,m.steel);
        });
        box(root,3.35,.19,2.65,0,.12,.02,m.darkSteel);
        const rolls=[roller(root,2.14,-.63,.23,2.54,m.gold),roller(root,1.72,-.18,.29,2.54,m.steel),roller(root,1.2,.39,.32,2.54,m.gold),roller(root,.65,.93,.18,2.54,m.steel)];
        const flutes=new THREE.InstancedMesh(new THREE.CylinderGeometry(.012,.012,2.5,5),m.gold,42),dummy=new THREE.Object3D();
        for(let j=0;j<42;j++){const a=j/42*Math.PI*2;dummy.position.set(0,Math.cos(a)*.325,Math.sin(a)*.325);dummy.rotation.z=Math.PI/2;dummy.updateMatrix();flutes.setMatrixAt(j,dummy.matrix);}rolls[2].add(flutes);
        roller(root,3,-.92,.07,2.82,m.gold);const web=box(root,2.36,.016,.56,0,2.28,-.38,m.paper);web.rotation.x=.7;
        motor(root,1.63,.44,.82);const fly=wheel(root,1.72,1.14,.18,.54);panel(root,1.63,1.9,-.3);
        box(root,2.52,.16,.08,0,.46,1.34,m.body);label(root,0,.45,1.388,.9);
        motion.push(t=>{rolls.forEach((r,j)=>r.rotation.x=t*(j%2?-.35:.35));fly.rotation.z=t*.25;});
        camera.position.set(5.9,3.85,7.9);camera.lookAt(0,1.4,0);
      }else if(index===2){
        // Rotary slitting and scoring station with multiple tool discs on the shafts.
        [-1,1].forEach(s=>{box(root,.31,1.92,1.22,s*1.53,1.02,-.55,m.bone);box(root,.45,.1,1.42,s*1.53,.07,-.51,m.darkSteel);box(root,.13,.78,.95,s*1.53,1.45,-.53,m.body);});
        box(root,2.78,.13,.18,0,.3,-1.03,m.darkSteel);
        const shafts=[];
        [-.88,-.33,.2].forEach((z,j)=>{const r=roller(root,1.48,z,.095,2.78,m.darkSteel);[-.91,-.31,.31,.91].forEach(x=>{cylinder(r,j===1?.235:.185,.045,x,0,0,m.steel);cylinder(r,.105,.065,x,0,0,m.gold);});shafts.push(r);});
        table(root,3,1.75,1.2,1.12,m.bone);[-1,1].forEach(s=>{box(root,.06,.04,1.62,s*1.16,1.27,1.1,m.darkSteel);rod(root,[s*1.38,.22,1.84],[s*1.38,1.15,.4],.035,m.darkSteel);});
        const sheet=new THREE.Group();root.add(sheet);box(sheet,2.14,.018,1.23,0,1.26,1.02,m.paper);[-.71,0,.71].forEach(x=>box(sheet,.012,.004,1.22,x,1.272,1.02,m.darkSteel));
        panel(root,-1.53,1.88,.085);motor(root,1.64,.57,-.66);label(root,0,1.17,2.005,.75);bolts(root,[[-1.53,.46,.07],[1.53,.46,.07],[-1.53,1.1,.07],[1.53,1.1,.07]]);
        motion.push(t=>{shafts.forEach((s,j)=>s.rotation.x=t*(j%2?-.5:.5));sheet.position.z=Math.sin(t*.55)*.12;});
      }else{
        // Clamshell platen press with pivoting bed, flywheel, crank and control arm.
        [-1,1].forEach(s=>{box(root,.38,.82,1.74,s*1.16,.48,-.26,m.body);box(root,.52,.14,1.98,s*1.16,.08,-.22,m.edge);rod(root,[s*1.18,.3,.48],[s*1.18,2.05,-.66],.15,m.body);cylinder(root,.34,.4,s*1.2,.8,.1,m.darkSteel);});
        box(root,2.63,.22,1.8,0,.21,-.31,m.body);
        const fixed=new THREE.Group();fixed.position.set(0,.93,-.68);fixed.rotation.x=-.13;root.add(fixed);
        box(fixed,2.5,1.76,.19,0,.82,0,m.body);box(fixed,2.19,1.49,.025,0,.82,.111,m.darkSteel);
        [-1,1].forEach(s=>box(fixed,.045,1.51,.04,s*1.05,.82,.142,m.gold));
        const bed=new THREE.Group();bed.position.set(0,.73,.18);root.add(bed);
        box(bed,2.58,1.58,.16,0,.74,0,m.body);box(bed,2.28,1.33,.035,0,.74,-.1,m.steel);box(bed,1.85,1.01,.008,0,.76,-.121,m.paper);
        // A shallow die-line is visible as the platen opens.
        const lineMat=new THREE.LineBasicMaterial({color:'#82653a'}),pts=[[-.68,.35,-.13],[.68,.35,-.13],[.68,1.15,-.13],[-.68,1.15,-.13],[-.68,.35,-.13]];
        bed.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(...p))),lineMat));
        rod(bed,[-1.42,1.32,.03],[1.42,1.32,.03],.045,m.steel);
        const fly=wheel(root,1.63,.99,-.51,.7);motor(root,1.39,.36,-.82);
        rod(root,[1.18,1.17,-.45],[1.18,.72,.81],.07,m.gold);rod(root,[-1.18,1.17,-.45],[-1.18,.72,.81],.07,m.gold);
        rod(root,[1.35,.5,-.88],[1.55,2.52,-.88],.037,m.steel);panel(root,1.55,2.43,-.8);label(root,0,.27,.603,.85);
        camera.position.y=5.2;camera.lookAt(0,1.15,.1);
        motion.push(t=>{bed.rotation.x=1.38+Math.sin(t*.6)*.12;fly.rotation.z=t*.22;});
      }
      return {slot,scene,camera,root,motion,hover:0,tilt:0,index};
    });
    section.classList.add('machines-ready');
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();failed=true;section.classList.remove('machines-ready');renderer.domElement.hidden=true;cancelAnimationFrame(frame);frame=0;});
  } catch(error) {failed=true;renderer?.dispose();renderer?.domElement.remove();section.classList.remove('machines-ready');}
}

function wake(){if(visible&&!failed&&!document.hidden&&!frame)frame=requestAnimationFrame(render);}
function render(now){
  frame=0;if(!visible||failed||document.hidden)return;
  if(!renderer)initialize();if(failed)return;
  const dt=Math.min(.05,(now-previous)/1000||.016);previous=now;const freeze=still();if(!freeze)time+=dt;
  if(width!==section.clientWidth||height!==innerHeight){width=section.clientWidth;height=innerHeight;renderer.setSize(width,height);}
  const rects=views.map(v=>v.slot.getBoundingClientRect());
  const sectionRect = section.getBoundingClientRect();
  const canvasOffset = Math.max(0, Math.min(-sectionRect.top - section.clientTop, Math.max(0, section.clientHeight - height)));
  const canvasTop = sectionRect.top + section.clientTop + canvasOffset;
  const canvasLeft = sectionRect.left + section.clientLeft;
  renderer.domElement.style.transform = 'translate3d(0,' + canvasOffset + 'px,0)';

  renderer.setScissorTest(false);renderer.setClearColor(0,0);renderer.clear();renderer.setScissorTest(true);let count=0;
  views.forEach((v,i)=>{const r=rects[i];if(r.bottom<=0||r.top>=height||r.width<=0)return;count++;
    const blend=freeze?1:1-Math.exp(-dt*5);v.hover+=((pointerIndex===i&&!freeze?pointerX*.17:0)-v.hover)*blend;v.tilt+=((pointerIndex===i&&!freeze?pointerY*.055:0)-v.tilt)*blend;
    const t=freeze?1.3:time+i*.9;v.root.rotation.y=-.15+(freeze?0:Math.sin(t*.22)*.065)+v.hover;v.root.rotation.x=v.tilt;v.motion.forEach(fn=>fn(t));
    v.camera.aspect=r.width/r.height;v.camera.updateProjectionMatrix();// Machine canvas coordinates follow its section.
    const left = r.left - canvasLeft, bottom = height - (r.bottom - canvasTop);
    renderer.setViewport(left, bottom, r.width, r.height);
    renderer.setScissor(Math.max(0, left), Math.max(0, bottom), Math.max(0, Math.min(width, left + r.width) - Math.max(0, left)), Math.max(0, Math.min(height, bottom + r.height) - Math.max(0, bottom)));renderer.render(v.scene,v.camera);
  });
  renderer.domElement.hidden=!count;section.dataset.motion=freeze?'paused':count?'running':'idle';
  if(!freeze&&count)frame=requestAnimationFrame(render);
}
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){previous=performance.now();wake();}else{cancelAnimationFrame(frame);frame=0;if(renderer)renderer.domElement.hidden=true;section.dataset.motion='idle';}},{rootMargin:'100px 0px'}).observe(section);
window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',wake,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;section.dataset.motion='idle';}else{previous=performance.now();wake();}});
reduced.addEventListener('change',wake);document.addEventListener('click',e=>{if(e.target.closest('#motion'))wake();});
const pause=section.querySelector('#machine-pause');pause.addEventListener('click',()=>{const value=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(value));pause.textContent=value?'Resume machines':'Pause machines';wake();});
slots.forEach((slot,i)=>{slot.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=slot.getBoundingClientRect();pointerIndex=i;pointerX=(e.clientX-r.left)/r.width*2-1;pointerY=(e.clientY-r.top)/r.height*2-1;wake();},{passive:true});slot.addEventListener('pointerleave',()=>{pointerIndex=-1;wake();},{passive:true});});
