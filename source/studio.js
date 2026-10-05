import * as THREE from '@alkarim/vendor/build/three.module.js';
import { RoundedBoxGeometry } from '@alkarim/vendor/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from '@alkarim/vendor/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '@alkarim/vendor/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '@alkarim/vendor/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from '@alkarim/vendor/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from '@alkarim/vendor/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from '@alkarim/vendor/examples/jsm/postprocessing/OutputPass.js';
import { SSAOPass } from '@alkarim/vendor/examples/jsm/postprocessing/SSAOPass.js';
import { mergeGeometries } from '@alkarim/vendor/examples/jsm/utils/BufferGeometryUtils.js';

const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let manualReduced=false;
const motionReduced=()=>reduced.matches||manualReduced;
const small = () => innerWidth < 1000;
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = (a,b,t) => THREE.MathUtils.smoothstep(t,a,b);
let renderer;
try {
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
  if (!window.WebGL2RenderingContext) throw new Error('WebGL 2 is unavailable');
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
} catch(e) {
  $('#loading').hidden=true; $('#graphics-message').hidden=false;
  $('#render-status').textContent='3D UNAVAILABLE';
  document.body.classList.add('graphics-unavailable');
  for (const el of document.querySelectorAll('.studio-tools button,.studio-tools input,#quality')) el.disabled=true;
}
if(renderer) { start(); document.body.classList.add('studio-ready'); }

function start(){
  renderer.setPixelRatio(Math.min(devicePixelRatio,1));
  renderer.setSize(innerWidth,innerHeight);
  renderer.shadowMap.enabled=true;
  // Every post-processing pass shares the same shadow map for this frame.
  renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.02;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  $('#stage').appendChild(renderer.domElement);
  const scene=new THREE.Scene(); scene.background=new THREE.Color('#0a0a0a');
  scene.fog=new THREE.FogExp2('#0a0a0a',.022);
  const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.1,80);
  const world=new THREE.Group();scene.add(world);
  const assembly=new THREE.Group();world.add(assembly);
  let lodMeshes=[];
  const parts=[];
  let activePart=-1, pinnedPart=-1;

  // Everything below is generated: no photographs, imported models or environment maps.
  // A small deterministic noise field drives color, roughness, fibers and normal detail.
  const noiseGLSL=`
  float h3(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
  float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
  `;
  function surface(color,roughness=.7,kind=0,extra={}){
    const m=new THREE.MeshPhysicalMaterial({color,roughness,metalness:0,...extra});
    m.onBeforeCompile=s=>{
      s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLocal=position;');
      s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>\nvarying vec3 vLocal;\n${noiseGLSL}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        float fiber=n3(vLocal*vec3(200.,650.,320.));
        float cloud=n3(vLocal*22.);
        float scratch=pow(n3(vLocal*vec3(8.,900.,140.)),18.);
        diffuseColor.rgb *= .97 + .055*fiber + .025*cloud;
        diffuseColor.rgb += scratch*.02;
      `)
      .replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(fiber-.5)*.075+scratch*.09,.04,1.);`)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nnormal=normalize(normal+vec3(dFdx(fiber),dFdy(fiber),0.)*${kind===1?'.012':'.026'});`);
    };
    m.customProgramCacheKey=()=>`paper-${kind}`;
    return m;
  }
  const bone=surface('#e3d7ba',.69);
  const inner=surface('#c6b694',.9);
  const amber=surface('#bb7025',.51,0,{clearcoat:.24,clearcoatRoughness:.48});
  const dark=surface('#242820',.82);
  const kraft=surface('#89704b',.98);
  const metal=surface('#747771',.29,1,{metalness:.92,anisotropy:.65});
  const blackMetal=surface('#232723',.38,1,{metalness:.8});
  const rubber=surface('#11170f',.95);
  const glass=surface('#eee9d8',.12,1,{transmission:.93,thickness:.07,ior:1.47,transparent:true,opacity:.36,clearcoat:1});
  const ink=new THREE.MeshStandardMaterial({color:'#1d2921',roughness:.8});
  const glow=new THREE.MeshStandardMaterial({color:'#ebbd67',emissive:'#e8a33d',emissiveIntensity:2});
  const geometryCache=new Map();
  function box(w,h,d,material,parent,x=0,y=0,z=0,r=.018){
    const key=[w,h,d,r].join();
    if(!geometryCache.has(key)) geometryCache.set(key,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/4,h/4,d/4)));
    const m=new THREE.Mesh(geometryCache.get(key),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(w*h*d<.0001)lodMeshes.push(m);return m;
  }
  function cyl(rad,height,mat,parent,x,y,z,segments=40){const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,height,segments),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function part(name,spec,offset){const g=new THREE.Group();g.name=name;g.userData={spec,offset:new THREE.Vector3(...offset),index:parts.length};assembly.add(g);parts.push(g);return g;}
  const body=part('Main packaging body','2.2 mm wrapped rigid board',[0,-.25,0]);
  const panels=part('Outer panels','Wrapped edges / 0.8 mm reveal',[-.8,.25,0]);
  const tray=part('Inner tray','Die-cut cavity / 18 mm depth',[0,1.05,0]);
  const support=part('Product support structure','Folded board / load-spreading ribs',[0,1.8,0]);
  const inserts=part('Inserts and separators','Removable / interlocking tabs',[0,2.55,0]);
  const flaps=part('Folding flaps','Scored hinge / 110° opening',[0,3.3,-.1]);
  const finish=part('Finishing layers','Satin wrap / clear presentation window',[0,4.05,0]);
  const display=part('Digital information display','Presentation module / live local state',[2.6,.5,.2]);

  // Rigid board body: individual walls, visible lamination and corner reinforcements.
  box(4,.12,3,inner,body,0,0,0);
  box(4,1.12,.105,bone,body,0,.6,1.45);
  box(4,1.12,.105,bone,body,0,.6,-1.45);
  for(const x of [-1.95,1.95]){box(.105,1.12,2.85,bone,body,x,.6,0);box(.012,.95,2.72,inner,body,x-Math.sign(x)*.064,.61,0);}
  box(3.75,.035,2.76,dark,body,0,.084,0);
  for(const x of [-1.83,1.83]) for(const z of [-1.32,1.32]){box(.15,.92,.15,kraft,body,x,.54,z);box(.2,.035,.2,inner,body,x,1.04,z);}
  for(const z of [-1.51,1.51]){
    box(3.89,.015,.008,inner,body,0,.19,z);
    box(3.89,.012,.009,inner,body,0,1.1,z);
  }
  // A warm paper spine and wrapped front apron distinguish the construction.
  box(.035,1.1,2.96,amber,panels,-2.018,.6,0);
  box(4.065,.21,.05,amber,panels,0,.195,1.512);
  box(4.065,.21,.05,amber,panels,0,.195,-1.512);
  for(let i=0;i<32;i++) box(.011,.17,.003,inner,panels,-1.7+i*.043,.195,1.54,.001);
  for(const x of [-1.98,1.98])box(.025,.89,.012,inner,panels,x,.65,1.515,.001);

  // Real die-cut apertures, rather than painted black holes.
  function roundedPath(shape,x,y,w,h,r){shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);}
  const shape=new THREE.Shape();roundedPath(shape,-1.83,-1.3,3.66,2.6,.07);
  for(const [x,w] of [[-1.59,1.02],[-.33,.86],[.77,.86]]){let hole=new THREE.Path();roundedPath(hole,x,-.92,w,1.84,.12);shape.holes.push(hole);}
  const trayMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:true,bevelThickness:.025,bevelSize:.014,bevelSegments:2,steps:1,curveSegments:16}),dark);
  trayMesh.rotation.x=-Math.PI/2;trayMesh.position.y=.47;trayMesh.castShadow=true;trayMesh.receiveShadow=true;tray.add(trayMesh);
  for(let i=0;i<4;i++)box(3.55,.013,.015,inner,tray,0,.47-i*.043,1.304,.002);
  for(const x of [-1.62,-.43,.64,1.65])box(.055,.31,2.48,inner,support,x,.27,0);
  for(const z of [-1.15,1.15])box(3.4,.31,.065,inner,support,0,.27,z);
  for(const x of [-1.5,-.24,.84]){box(.69,.085,1.63,kraft,inserts,x+.32,.19,0);box(.67,.18,.035,inner,inserts,x+.32,.32,-.75);box(.67,.18,.035,inner,inserts,x+.32,.32,.75);}
  // Neutral product surrogates support the packaging story, without product branding.
  const contents=new THREE.Group();tray.add(contents);
  const vial=cyl(.34,.62,glass,contents,-1.06,.77,0);
  cyl(.345,.12,blackMetal,contents,-1.06,1.12,0);
  cyl(.26,.5,amber,contents,-1.06,.70,0);
  for(const x of [.12,1.2]){box(.62,.42,1.45,bone,contents,x,.54,0,.04);box(.625,.09,1.455,amber,contents,x,.47,0,.01);box(.32,.012,.58,dark,contents,x,.758,0,.002);}

  const lidPivot=new THREE.Group();lidPivot.position.set(0,1.19,-1.48);flaps.add(lidPivot);
  box(4.1,.115,3.08,bone,lidPivot,0,.04,1.5,.035);
  box(3.9,.022,2.88,inner,lidPivot,0,-.027,1.5,.01);
  const leftWing=new THREE.Group(),rightWing=new THREE.Group();
  leftWing.position.set(-1.91,.84,0);rightWing.position.set(1.91,.84,0);flaps.add(leftWing,rightWing);
  box(.55,.034,2.57,inner,leftWing,.27,0,0,.013);
  box(.55,.034,2.57,inner,rightWing,-.27,0,0,.013);
  for(const z of [-.92,-.65,-.38,-.11,.16,.43,.7,.97]){box(.006,.008,.16,kraft,leftWing,0,.02,z,.001);box(.006,.008,.16,kraft,rightWing,0,.02,z,.001);}
  for(const x of [-1.7,1.7]){box(.21,.04,.12,dark,lidPivot,x,-.04,.035);box(.21,.07,.14,dark,body,x,1.14,-1.46);}

  // Printing is generated with Canvas2D, only type and manufacturing marks; no image inputs.
  function printTexture(draw,w=1024,h=768){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
  const topPrint=printTexture((c,w,h)=>{
    c.fillStyle='#e1d5b8';c.fillRect(0,0,w,h);
    c.fillStyle='#b47b33';c.fillRect(0,0,125,h);
    c.strokeStyle='#5d654c';c.lineWidth=2;c.strokeRect(165,46,w-210,h-92);
    c.fillStyle='#273021';c.font='22px Arial';c.fillText('M A T E R I A L   /   F O R M   /   P U R P O S E',210,105);
    c.font='bold 104px Arial';c.fillText('STRUCTURE',205,285);c.fillText('& SUBSTANCE',205,390);
    c.font='22px Arial';c.fillText('RIGID PRESENTATION SYSTEM',210,455);
    c.fillStyle='#72735b';c.font='18px Arial';c.fillText('01    /    320 × 240 × 110 MM',210,655);
    c.strokeStyle='#85866b';c.lineWidth=1;
    for(let i=0;i<18;i++){c.beginPath();c.moveTo(800+i*5,520);c.lineTo(800+i*5,656);c.stroke();}
    c.save();c.translate(73,710);c.rotate(-Math.PI/2);c.fillStyle='#28291d';c.font='bold 24px Arial';c.fillText('PRECISION IN EVERY FOLD',0,0);c.restore();
    // restrained generated paper fibers and coating variance
    let seed=17;for(let i=0;i<16000;i++){seed=(seed*1664525+1013904223)>>>0;const x=(seed%w);seed=(seed*1664525+1013904223)>>>0;const y=seed%h;c.fillStyle=i%2?'#ffffff09':'#322d2308';c.fillRect(x,y,1,2);}
  });
  const printedMaterial=surface('#ffffff',.64,0,{map:topPrint,clearcoat:.15,clearcoatRoughness:.55});
  const topSheet=new THREE.Mesh(new THREE.PlaneGeometry(4.04,3.02),printedMaterial);topSheet.rotation.x=-Math.PI/2;topSheet.position.set(0,.100,1.5);lidPivot.add(topSheet);
  const finishPivot=new THREE.Group();finishPivot.position.copy(lidPivot.position);finish.add(finishPivot);
  // Clear film sleeve with folded edge returns and faint manufacturing marks.
  box(4.115,.012,3.09,glass,finishPivot,0,.115,1.5,.005);
  box(.015,.105,3.09,glass,finishPivot,-2.05,.065,1.5,.004);
  box(.015,.105,3.09,glass,finishPivot,2.05,.065,1.5,.004);
  for(let i=0;i<9;i++){const scratch=box(.22+i*.012,.001,.002,glass,finishPivot,1.55-i*.015,.123,.4+i*.045,.0003);scratch.rotation.y=.4;}
  const frontPrint=printTexture((c,w,h)=>{c.clearRect(0,0,w,h);c.fillStyle='#343b2b';c.font='30px Arial';c.fillText('PRESENTATION SERIES',30,55);c.font='18px Arial';c.fillText('WRAPPED BOARD   /   REMOVABLE INSERT',30,91);c.fillRect(725,30,2,62);c.font='42px Arial';c.fillText('01',758,77);},1024,128);
  const frontLabel=new THREE.Mesh(new THREE.PlaneGeometry(3.1,.38),new THREE.MeshStandardMaterial({map:frontPrint,transparent:true,roughness:.8,depthWrite:false}));frontLabel.position.set(0,.75,1.511);body.add(frontLabel);

  // Discrete display module, bracket, cable, port and four small fasteners.
  const screenRig=new THREE.Group();screenRig.position.set(2.25,.2,.85);screenRig.rotation.y=-.16;display.add(screenRig);
  box(.91,.095,.63,blackMetal,screenRig,0,-.09,0);
  box(.07,.57,.08,metal,screenRig,0,.21,-.1);
  const screen=new THREE.Group();screen.position.set(0,.58,0);screen.rotation.x=-.2;screenRig.add(screen);
  box(1.0,.76,.08,blackMetal,screen,0,0,0,.035);
  let displayCanvas,displayContext;
  const displayMap=printTexture((c)=>{displayContext=c;displayCanvas=c.canvas;},768,512);
  const screenFace=new THREE.Mesh(new THREE.PlaneGeometry(.92,.65),new THREE.MeshStandardMaterial({map:displayMap,emissiveMap:displayMap,emissive:'#fff4ce',emissiveIntensity:.55,roughness:.37}));screenFace.position.z=.047;screen.add(screenFace);
  function drawDisplay(open,expanded,count){const c=displayContext;c.fillStyle='#111a14';c.fillRect(0,0,768,512);c.fillStyle='#e8ac59';c.font='bold 29px Arial';c.fillText('PACKAGING / LIVE STUDY',35,51);c.fillStyle='#849a83';c.fillRect(35,73,698,1);const rows=[['DIMENSIONS',expanded?'440 × 240 × 110 MM':'320 × 240 × 110 MM'],['TYPE',expanded?'PRESENTATION':'COMPACT RIGID'],['MATERIAL','WRAPPED BOARD'],['QUANTITY','01 UNIT'],['PRODUCTION','DESIGN STUDY'],['FINISH','MATTE / SATIN'],['STRUCTURE',open?'OPEN / DISPLAY':'CLOSED / PROTECTED']];rows.forEach((r,i)=>{c.fillStyle='#7f927e';c.font='21px Arial';c.fillText(r[0],35,120+i*49);c.fillStyle='#e0dfc9';c.font='23px Arial';c.fillText(r[1],270,120+i*49);});c.fillStyle='#e8ac59';c.font='18px Arial';c.fillText(`CAPTURE ${String(count).padStart(2,'0')}   •   LOCAL PREVIEW`,35,487);displayMap.needsUpdate=true;}
  drawDisplay(false,false,0);
  for(const x of [-.455,.455])for(const y of [-.335,.335]){const s=cyl(.018,.014,metal,screen,x,y,.049,16);s.rotation.x=Math.PI/2;}
  box(.12,.025,.025,rubber,screenRig,.38,-.09,.325,.003);
  const cablePath=new THREE.CatmullRomCurve3([new THREE.Vector3(2.25,.04,.65),new THREE.Vector3(2.5,-.08,.45),new THREE.Vector3(1.8,-.13,-.25),new THREE.Vector3(1.82,.28,-1.43)]);
  const cable=new THREE.Mesh(new THREE.TubeGeometry(cablePath,36,.018,8,false),rubber);display.add(cable);

  // Heavy protective corrugated housing and reinforced corner rails.
  const housing=new THREE.Group();world.add(housing);housing.visible=false;
  box(4.8,.2,3.8,kraft,housing,0,-.25,0);
  for(const x of [-2.33,2.33])box(.16,1.66,3.8,kraft,housing,x,.5,0);
  for(const z of [-1.82,1.82])box(4.56,1.66,.16,kraft,housing,0,.5,z);
  for(const x of [-2.15,2.15])for(const z of [-1.63,1.63]){box(.17,1.6,.17,dark,housing,x,.51,z);for(const y of [-.13,1.1]){box(.31,.085,.31,metal,housing,x,y,z);cyl(.042,.035,blackMetal,housing,x,y+.055,z,16);}}
  for(let i=0;i<64;i++){const x=-2.2+i*.07;box(.033,.032,.10,inner,housing,x,1.347,1.82,.004);box(.033,.032,.10,inner,housing,x,1.347,-1.82,.004);}
  const houseFlapL=new THREE.Group(),houseFlapR=new THREE.Group();houseFlapL.position.set(-2.4,1.33,0);houseFlapR.position.set(2.4,1.33,0);housing.add(houseFlapL,houseFlapR);
  box(1.6,.055,3.75,kraft,houseFlapL,.8,0,0);box(1.6,.055,3.75,kraft,houseFlapR,-.8,0,0);
  houseFlapL.rotation.z=1.9;houseFlapR.rotation.z=-1.9;

  const platform=new THREE.Group();scene.add(platform);
  const compactOutline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(4.12,1.4,3.1)),new THREE.LineBasicMaterial({color:'#e8a33d',transparent:true,opacity:.65}));compactOutline.position.y=.6;assembly.add(compactOutline);compactOutline.visible=false;
  box(5.8,.22,4.2,surface('#292b25',.42,1,{metalness:.32}),platform,0,-.38,0,.07);
  box(5.56,.05,3.96,blackMetal,platform,0,-.51,0,.02);
  for(const x of [-2.3,2.3])for(const z of [-1.7,1.7])cyl(.13,.18,rubber,platform,x,-.59,z,24);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(150,150),surface('#151713',.5,1,{metalness:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=-.7;floor.receiveShadow=true;scene.add(floor);
  const architecture=new THREE.Group();scene.add(architecture);architecture.visible=false;
  for(let i=0;i<7;i++){box(.25,7,.35,dark,architecture,-7+i*2.3,2,-7);box(.045,5,.05,glow,architecture,-6.96+i*2.3,2,-6.8,.01);}
  box(2.1,.06,1.3,inner,architecture,-3.4,-.62,2.3);box(1.8,.06,1.2,kraft,architecture,-3.6,-.55,2.2);
  // High dynamic range procedural studio: emissive softboxes baked with PMREM.
  const envScene=new THREE.Scene();envScene.background=new THREE.Color('#737469');
  const studioWall=new THREE.Mesh(new THREE.BoxGeometry(30,20,30),new THREE.MeshBasicMaterial({color:'#292e28',side:THREE.BackSide}));envScene.add(studioWall);
  function softbox(w,h,x,y,z,intensity){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(intensity,intensity*.96,intensity*.85),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);envScene.add(m);}
  softbox(9,7,-5,7,5,9);softbox(4,8,6,4,-2,5);softbox(7,2,0,9,-5,7);
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromScene(envScene,.06,.1,60);scene.environment=environment.texture;scene.environmentIntensity=.4;pmrem.dispose();
  const key=new THREE.SpotLight('#fff0d3',155,35,.58,.7,1.6);key.position.set(-3,8,6);key.target.position.set(0,.3,0);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0003;key.shadow.normalBias=.03;key.shadow.radius=3;scene.add(key,key.target);
  const fill=new THREE.RectAreaLight('#c3d0bb',7,5,5);fill.position.set(5,4,3);fill.lookAt(0,0,0);scene.add(fill);
  const rim=new THREE.SpotLight('#efb764',85,25,.8,.6,1.5);rim.position.set(3,6,-5);rim.target.position.set(0,1,0);scene.add(rim,rim.target);
  scene.add(new THREE.HemisphereLight('#e9ead7','#141910',.5));

  // Batch only identical, opaque siblings. Their original vertex coordinates,
  // materials, hinge parents and independent exploded groups remain unchanged.
  const lodSet=new Set(lodMeshes);
  let batchedMeshCount=0;
  function instanceRepeatedDetails(group){
    for(const child of [...group.children])if(child.isGroup)instanceRepeatedDetails(child);
    const buckets=new Map();
    for(const child of group.children){
      if(!child.isMesh||child.isInstancedMesh||child.material.transparent||child.material.transmission>0)continue;
      const id=[child.geometry.uuid,child.material.uuid,child.castShadow,child.receiveShadow,lodSet.has(child)].join('|');
      if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(child);
    }
    for(const items of buckets.values()){
      if(items.length<2)continue;
      const first=items[0],batch=new THREE.InstancedMesh(first.geometry,first.material,items.length);
      batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
      items.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);group.remove(mesh);lodSet.delete(mesh);});
      batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);
      if(lodMeshes.includes(first))lodSet.add(batch);
      batchedMeshCount+=items.length-1;
    }
  }
  instanceRepeatedDetails(world);instanceRepeatedDetails(platform);instanceRepeatedDetails(architecture);
  function mergeStaticSurfaces(group){
    for(const child of [...group.children])if(child.isGroup)mergeStaticSurfaces(child);
    const buckets=new Map();
    for(const mesh of group.children){
      if(!mesh.isMesh||mesh.isInstancedMesh||mesh.material.transparent||mesh.material.transmission>0)continue;
      const id=[mesh.material.uuid,mesh.castShadow,mesh.receiveShadow,lodSet.has(mesh)].join('|');
      if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(mesh);
    }
    for(const meshes of buckets.values()){
      if(meshes.length<2)continue;
      const first=meshes[0],wasLOD=lodSet.has(first);
      const geometries=meshes.map(mesh=>{mesh.updateMatrix();const geo=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geo.setAttribute('paperPosition',geo.getAttribute('position').clone());geo.applyMatrix4(mesh.matrix);return geo;});
      const geometry=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());
      if(!geometry)throw new Error('Incompatible packaging surface attributes');
      const original=first.material,material=original.clone();
      material.onBeforeCompile=shader=>{original.onBeforeCompile(shader);shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 paperPosition;').replace('vLocal=position;','vLocal=paperPosition;');};
      material.customProgramCacheKey=()=>original.customProgramCacheKey()+'-batched';
      const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=first.castShadow;mesh.receiveShadow=first.receiveShadow;group.add(mesh);
      for(const old of meshes){group.remove(old);lodSet.delete(old);}if(wasLOD)lodSet.add(mesh);
      batchedMeshCount+=meshes.length-1;
    }
  }
  mergeStaticSurfaces(world);mergeStaticSurfaces(platform);mergeStaticSurfaces(architecture);
  lodMeshes=[...lodSet];
  const composer=new EffectComposer(renderer);const beautyPass=new RenderPass(scene,camera);composer.addPass(beautyPass);
  const ao=new SSAOPass(scene,camera,innerWidth,innerHeight,12);ao.kernelRadius=.32;ao.minDistance=.001;ao.maxDistance=.12;composer.addPass(ao);
  let ssr=null,ssrLoading=null;
  function loadReflections(){
    return ssrLoading??=import('@alkarim/vendor/examples/jsm/postprocessing/SSRPass.js').then(({SSRPass})=>{
      ssr=new SSRPass({renderer,scene,camera,width:Math.round(innerWidth*.5),height:Math.round(innerHeight*.5),selects:[floor]});
      ssr.opacity=.16;ssr.maxDistance=4;ssr.thickness=.1;composer.insertPass(ssr,2);resize();
    }).catch(()=>{ssrLoading=null;highQuality=false;$('#quality').textContent='Studio quality';$('#quality').setAttribute('aria-pressed','false');applyQuality();});
  }
  const bokeh=new BokehPass(scene,camera,{focus:11,aperture:.00012,maxblur:.003});composer.addPass(bokeh);
  const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.13,.35,1.6);composer.addPass(bloom);
  const film=new ShaderPass({uniforms:{tDiffuse:{value:null},time:{value:0},amount:{value:.0012}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D tDiffuse;uniform float time;uniform float amount;varying vec2 vUv;void main(){vec2 d=(vUv-.5)*.0003;vec3 c=texture2D(tDiffuse,vUv).rgb;c.r=texture2D(tDiffuse,vUv+d).r;c.b=texture2D(tDiffuse,vUv-d).b;float n=fract(sin(dot(vUv+fract(time),vec2(12.9898,78.233)))*43758.5453);c+=(n-.5)*amount;c*=1.-.21*pow(length(vUv-.5),1.5);gl_FragColor=vec4(c,1.);}`});composer.addPass(film);composer.addPass(new OutputPass());
  let highQuality=false;
  function applyQuality(){
    const useReflections=!!ssr&&highQuality&&!small();
    if(ssr)ssr.enabled=useReflections;
    // SSR supplies its own beauty pass; the preceding beauty/AO was overwritten.
    beautyPass.enabled=!useReflections;ao.enabled=highQuality&&!small()&&!useReflections;bokeh.enabled=highQuality&&!small();bloom.enabled=highQuality;
    const ratio=Math.min(devicePixelRatio,highQuality?1.5:1);
    if(renderer.getPixelRatio()!==ratio){renderer.setPixelRatio(ratio);composer.setPixelRatio(ratio);}
  }
  applyQuality();
  $('#quality').addEventListener('click',()=>{highQuality=!highQuality;$('#quality').textContent=highQuality?'Enhanced quality':'Studio quality';$('#quality').setAttribute('aria-pressed',highQuality);if(highQuality&&!small()&&!ssr)loadReflections();resize();wake();});
  const motionButton=document.createElement('button');motionButton.id='motion';motionButton.textContent='Reduce motion';motionButton.setAttribute('aria-pressed','false');$('.quality').appendChild(motionButton);motionButton.addEventListener('click',()=>{manualReduced=!manualReduced;motionButton.setAttribute('aria-pressed',manualReduced);motionButton.textContent=manualReduced?'Motion reduced':'Reduce motion';document.documentElement.style.scrollBehavior=motionReduced()?'auto':'smooth';wake();});

  const labels=$('#labels');
  const lineSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');lineSvg.id='leader-lines';lineSvg.setAttribute('aria-hidden','true');document.body.appendChild(lineSvg);
  const leaderLines=parts.map(()=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');lineSvg.appendChild(path);return path;});
  const anchors=[[1.7,.65,1.5],[-2,.6,0],[1.7,.55,0],[1.65,.35,0],[1.3,.3,0],[1.8,1.25,0],[1.8,1.32,0],[2.5,.7,.85]];
  parts.forEach((p,i)=>{const button=document.createElement('button');button.className='part-label';button.innerHTML=`<span>${String(i+1).padStart(2,'0')} — ${p.name}</span><small>${p.userData.spec}</small>`;button.setAttribute('aria-pressed','false');button.addEventListener('pointerenter',()=>highlight(i));button.addEventListener('pointerleave',()=>highlight(pinnedPart));button.addEventListener('focus',()=>highlight(i));button.addEventListener('blur',()=>highlight(pinnedPart));button.addEventListener('click',()=>{pinnedPart=pinnedPart===i?-1:i;highlight(pinnedPart);});labels.appendChild(button);});
  // Clone each material only once per component, so isolation never alters shared finishes.
  const componentMaterials=parts.map(p=>{const copies=new Map();p.traverse(m=>{if(!m.isMesh)return;const original=m.material;if(!copies.has(original)){const copy=original.clone();copy.onBeforeCompile=original.onBeforeCompile;copy.customProgramCacheKey=original.customProgramCacheKey;copy.userData.originalColor=copy.color.clone();copies.set(original,copy);}m.material=copies.get(original);});return [...copies.values()];});
  function highlight(index){
    if(index!==activePart){activePart=index;componentMaterials.forEach((materials,i)=>materials.forEach(m=>m.color.copy(m.userData.originalColor).multiplyScalar(index<0||index===i?1:.23)));}
    labelButtons.forEach((button,i)=>button.setAttribute('aria-pressed',i===pinnedPart));
  }
  const labelButtons=[...labels.children],labelRects=[],anchorPoints=anchors.map(p=>new THREE.Vector3(...p)),projectedPoint=new THREE.Vector3(),focusPoint=new THREE.Vector3(0,.9,0);
  const ui={progress:$('#progress'),number:$('#process-number'),scene:$('#scene-name'),stage:$('#stage'),stats:$('.stats'),pan:$('#pan'),tilt:$('#tilt')};

  let open=false,expanded=false,sound=false,count=0,openSmooth=0,formatSmooth=0,panValue=0,tiltValue=0;
  let audioCtx;
  function playSound(){if(!sound)return;audioCtx??=new AudioContext();audioCtx.resume();const duration=.22,buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*duration,audioCtx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);const source=audioCtx.createBufferSource();source.buffer=buffer;const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1400;const gain=audioCtx.createGain();gain.gain.value=.065;source.connect(filter).connect(gain).connect(audioCtx.destination);source.start();}
  $('#open-box').addEventListener('click',()=>{open=!open;$('#open-box').setAttribute('aria-pressed',open);$('#open-box').innerHTML=`<span class="button-icon">${open?'−':'＋'}</span><span>${open?'Close packaging':'Open packaging'}</span>`;playSound();updateState();});
  $('#format').addEventListener('click',()=>{expanded=!expanded;$('#format').setAttribute('aria-pressed',expanded);$('#format').textContent=expanded?'Compact format':'Compare formats';playSound();updateState();});
  $('#sound').addEventListener('click',()=>{sound=!sound;$('#sound').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',sound);playSound();});
  function updateState(){drawDisplay(open,expanded,count);$('#studio-status').textContent=`${expanded?'EXPANDED PRESENTATION · 440':'COMPACT FORMAT · 320'} × 240 × 110 MM${open?' · OPEN':''}`;wake();}
  for(const id of ['pan','tilt'])$('#'+id).addEventListener('input',()=>{panValue=Number(ui.pan.value);tiltValue=Number(ui.tilt.value);$('#'+id+'-value').textContent=$('#'+id).value+'°';$('#horizon').textContent=`— ${ui.tilt.value}° —`;wake();});
  $('#reset').addEventListener('click',()=>{panValue=tiltValue=0;for(const id of ['pan','tilt']){$('#'+id).value=0;$('#'+id+'-value').textContent='0°';}$('#horizon').textContent='— 0° —';wake();});
  $('#capture').addEventListener('click',()=>{composer.render();const uri=renderer.domElement.toDataURL('image/png');$('#captured-image').src=uri;$('#download-capture').href=uri;$('#capture-preview').hidden=false;$('#close-capture').focus();count++;$('#capture-count').textContent=String(count).padStart(2,'0');updateState();playSound();});
  $('#close-capture').addEventListener('click',()=>{$('#capture-preview').hidden=true;$('#capture').focus();});

  const chapters=[...document.querySelectorAll('[data-chapter]')];let positions=[];let scroll=scrollY,targetScroll=scrollY,lastTime=0,raf=0,frame=0,stageIndex=0;
  let viewportWidth=innerWidth,viewportHeight=innerHeight,mobileLayout=small(),scrollRange=1,storyEnd=Infinity;
  let uiStage=-1,labelsVisible=false,labelLayoutDirty=true,lastLeaderUpdate=0,stageDimmed=false,lastDetailVisible=null,lastProgress=-1;
  let resizeFrame=0;
  const sceneNames=['01 — THE OBJECT','02 — THE STRUCTURE','03 — THE ANATOMY','04 — THE PROTECTION','05 — THE PRESENTATION','06 — THE ENGINEERING','07 — THE STUDIO'];
  function measure(){positions=chapters.map(el=>({top:el.offsetTop,height:el.offsetHeight}));scrollRange=Math.max(1,document.documentElement.scrollHeight-viewportHeight);storyEnd=$('#packages').offsetTop;labelLayoutDirty=true;}
  function resize(){viewportWidth=innerWidth;viewportHeight=innerHeight;mobileLayout=small();camera.aspect=viewportWidth/viewportHeight;camera.fov=mobileLayout?47:36;camera.updateProjectionMatrix();applyQuality();renderer.setSize(viewportWidth,viewportHeight);composer.setSize(viewportWidth,viewportHeight);ssr?.setSize(Math.round(viewportWidth*.5),Math.round(viewportHeight*.5));if(highQuality&&!mobileLayout&&!ssr)loadReflections();measure();}
  function wake(){if(!raf&&!document.hidden){lastTime=performance.now();raf=requestAnimationFrame(render);}}
  addEventListener('resize',()=>{if(resizeFrame)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;resize();wake();});});
  document.addEventListener('click',()=>wake());reduced.addEventListener('change',wake);
  addEventListener('scroll',()=>{targetScroll=scrollY;wake();},{passive:true});
  document.fonts.ready.then(()=>{measure();wake();});
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let pointerAt=0;
  addEventListener('pointermove',e=>{if(stageIndex!==2||e.target.closest('button')||performance.now()-pointerAt<90)return;pointerAt=performance.now();pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(parts,true)[0];if(hit){let o=hit.object;while(o.parent!==assembly&&o.parent)o=o.parent;highlight(o.userData.index??pinnedPart);}else highlight(pinnedPart);});
  measure();
  const cameraTarget=new THREE.Vector3();
  function render(now){
    if(document.hidden){raf=0;return;}
    // The opaque contact/footer covers the entire canvas here. Resume on scroll.
    if(targetScroll>=storyEnd-1){ui.progress.style.transform=`scaleY(${clamp(targetScroll/scrollRange,0,1)})`;ui.number.textContent='07 / 07';ui.scene.textContent=targetScroll>=$('#contact').offsetTop-viewportHeight*.5?'CONTACT & LOCATION':'MORE PACKAGES';uiStage=-1;lastProgress=-1;labels.hidden=true;lineSvg.style.display='none';labelsVisible=false;raf=0;return;}
    const dt=Math.min((now-lastTime)/1000||.016,.5);lastTime=now;const inertia=motionReduced()?1:1-Math.exp(-dt*7);
    scroll=mix(scroll,targetScroll,inertia);openSmooth=mix(openSmooth,open?1:0,motionReduced()?1:1-Math.exp(-dt*5));formatSmooth=mix(formatSmooth,expanded?1:0,motionReduced()?1:1-Math.exp(-dt*4));
    let idx=0;for(let i=1;i<positions.length;i++)if(scroll>=positions[i].top-viewportHeight*.35)idx=i;
    stageIndex=idx;
    if(idx!==2&&activePart!==-1){pinnedPart=-1;highlight(-1);}
    const t=now*.001;let explode=0,opening=0,protect=0,present=0,studio=0;
    const q=(scroll-positions[2].top+innerHeight*.3)/positions[2].height;
    explode=smooth(0,.5,q)*(1-smooth(.78,1.1,q));
    opening=smooth(positions[1].top-innerHeight*.5,positions[1].top+innerHeight*.4,scroll)*(1-smooth(positions[2].top-innerHeight*.2,positions[2].top+innerHeight*.3,scroll));
    protect=smooth(positions[3].top-innerHeight*.5,positions[3].top+innerHeight*.2,scroll)*(1-smooth(positions[4].top-innerHeight*.4,positions[4].top+innerHeight*.2,scroll));
    present=smooth(positions[4].top-innerHeight*.35,positions[4].top+innerHeight*.3,scroll)*(1-smooth(positions[5].top+innerHeight*.35,positions[6].top-innerHeight*.25,scroll));
    studio=smooth(positions[6].top-innerHeight*.5,positions[6].top+innerHeight*.15,scroll);
    if(motionReduced()){explode=explode>.5?1:0;opening=opening>.5?1:0;present=present>.5?1:0;protect=protect>.5?1:0;}
    const totalOpen=Math.max(opening,present,studio*openSmooth);
    parts.forEach((part,i)=>{const localExplosion=motionReduced()?explode:smooth(i*.045,.5+i*.045,explode);part.position.copy(part.userData.offset).multiplyScalar(localExplosion);part.scale.x=i===7?1:1+studio*formatSmooth*.375;});
    lidPivot.rotation.x=-totalOpen*1.85-explode*.22;
    finishPivot.rotation.x=lidPivot.rotation.x;
    leftWing.rotation.z=totalOpen*.85;rightWing.rotation.z=-totalOpen*.85;
    contents.visible=explode<.2;
    housing.visible=protect>.01;housing.position.y=mix(-4.2,0,protect);housing.rotation.copy(assembly.rotation);
    assembly.position.y=explode*.2+protect*.27;
    assembly.rotation.y=(motionReduced()?-.28:-.28+Math.sin(t*.17)*.065)*(1-studio)+studio*(panValue*Math.PI/180-.25);
    assembly.rotation.x=studio*tiltValue*Math.PI/180;
    housing.rotation.y=assembly.rotation.y;
    platform.rotation.y=assembly.rotation.y*.18;
    compactOutline.visible=studio>.9&&formatSmooth>.5;
    leftWing.rotation.z+=studio*formatSmooth*.65;rightWing.rotation.z-=studio*formatSmooth*.65;
    display.position.x+=studio*formatSmooth*.75;
    architecture.visible=studio>.05;architecture.position.y=(1-studio)*-10;
    key.intensity=115+studio*30+studio*openSmooth*25;
    rim.intensity=85+studio*formatSmooth*30;
    // Wider framing in the exploded state; mobile places the object below the copy.
    const mobile=mobileLayout;
    const cx=mobile?7.3:7.6,cz=mobile?11.2:11.3;
    camera.position.set(cx+explode*2.2,6+explode*2,cz+explode*3);
    cameraTarget.set(mobile?-.05:-2.5+explode*.8, mobile?2.45:1.1,0);
    if(mobile){camera.position.y+=1;cameraTarget.y=mix(mix(2.45,3.25,explode),.8,studio);cameraTarget.x=explode*2.0;camera.position.z+=1.9+explode*8+studio*formatSmooth*5;}
    cameraTarget.y+=explode*.65;
    camera.lookAt(cameraTarget);bokeh.uniforms.focus.value=camera.position.distanceTo(focusPoint);
    if(frame%15===0){const detailVisible=camera.position.distanceTo(assembly.position)<17||highQuality;if(detailVisible!==lastDetailVisible){lodMeshes.forEach(m=>m.visible=detailVisible);lastDetailVisible=detailVisible;}}
    film.uniforms.time.value=motionReduced()?0:t;
    frame++;
    const progress=Math.round(clamp(scroll/scrollRange,0,1)*10000)/10000;
    if(progress!==lastProgress){ui.progress.style.transform=`scaleY(${progress})`;lastProgress=progress;}
    if(idx!==uiStage){ui.number.textContent=`${String(idx+1).padStart(2,'0')} / 07`;ui.scene.textContent=sceneNames[idx];ui.stats.classList.toggle('active',idx===5);uiStage=idx;}
    const showLabels=idx===2&&explode>=.15;
    if(showLabels!==labelsVisible){labels.hidden=!showLabels;lineSvg.style.display=showLabels?'block':'none';labelsVisible=showLabels;labelLayoutDirty=true;}
    if(showLabels&&labelLayoutDirty){
      labelButtons.forEach((label,i)=>label.style.top=(mobile?34+[6,5,4,3,2,1,0,7][i]*6.8:20+[6,5,4,3,2,1,0,7][i]*7.7)+'%');
      // All layout reads happen together, once when shown/resized, never per frame.
      labelButtons.forEach((label,i)=>labelRects[i]=label.getBoundingClientRect());labelLayoutDirty=false;
    }
    if(showLabels&&now-lastLeaderUpdate>50){
      assembly.updateWorldMatrix(true,true);camera.updateMatrixWorld();
      labelButtons.forEach((label,i)=>{const reveal=explode>i*.08+.15;
        if(label.dataset.revealed!==String(reveal)){label.dataset.revealed=String(reveal);label.style.opacity=reveal?'1':'0';label.style.pointerEvents=reveal?'auto':'none';label.tabIndex=reveal?0:-1;leaderLines[i].style.opacity=reveal?'0.35':'0';}
        if(!reveal)return;
        projectedPoint.copy(anchorPoints[i]).applyMatrix4(parts[i].matrixWorld).project(camera);
        const x=(projectedPoint.x*.5+.5)*viewportWidth,y=(-projectedPoint.y*.5+.5)*viewportHeight,rect=labelRects[i];
        leaderLines[i].setAttribute('d',`M${x.toFixed(1)},${y.toFixed(1)} L${rect.left-17},${rect.top+16} H${rect.left-4}`);
      });lastLeaderUpdate=now;
    }
    const dimmed=scroll>positions[6].top+positions[6].height-viewportHeight*.25;
    if(dimmed!==stageDimmed){ui.stage.style.opacity=dimmed?'0.25':'1';stageDimmed=dimmed;}
    renderer.shadowMap.needsUpdate=true;
    composer.render();raf=motionReduced()?0:requestAnimationFrame(render);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);$('#graphics-message').hidden=false;$('#graphics-message strong').textContent='The graphics session was interrupted.';$('#graphics-message p').textContent='Reload this page to restart the 3D studio.';});
  ui.progress.style.height='100%';ui.progress.style.transformOrigin='top';
  resize();$('#loading').hidden=true;wake();
  // Read-only diagnostics for reproducible browser QA.
  window.packagingStudy={getState:()=>({open,expanded,count,activePart,reducedMotion:reduced.matches,stageIndex,parts:parts.map(p=>p.name),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,highQuality})};
}




