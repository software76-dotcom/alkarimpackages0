import './reveals.js';
let enabled=false;
const status=document.querySelector('#loading');
async function loadStudio(){
  if(enabled)return;enabled=true;
  status.hidden=false;
  document.querySelectorAll('.load-studio').forEach(b=>{b.disabled=true;b.textContent='Loading 3D…';});
  try{
    await import('./studio.js');
    if(document.body.classList.contains('graphics-unavailable'))throw new Error('WebGL unavailable');
    document.querySelectorAll('.studio-tools button,.studio-tools input,#quality').forEach(b=>b.disabled=false);
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const task=entry.target.id==='packages'?import('./packages.js'):import('./manufacturing.js');
      task.catch(()=>{/* Accessible SVG illustrations remain visible. */});
      observer.unobserve(entry.target);
    }),{rootMargin:'200px'});
    ['packages','manufacturing'].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
    window.siteTrack?.('studio_enabled');
  }catch{
    document.body.classList.add('graphics-unavailable');
    const message=document.querySelector('#graphics-message');message.hidden=false;
    message.querySelector('strong').textContent='The 3D preview is unavailable.';
    message.querySelector('p').textContent='You can still explore the packaging details and contact us. Reload this page to try the studio again.';
  }finally{
    status.hidden=true;
    document.querySelectorAll('.load-studio').forEach(b=>{b.hidden=true});
  }
}
document.querySelectorAll('.studio-tools button,.studio-tools input,#quality').forEach(b=>b.disabled=true);
document.querySelectorAll('.load-studio').forEach(b=>b.addEventListener('click',()=>{setTimeout(loadStudio,0)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const preview=document.querySelector('#capture-preview');if(preview&&!preview.hidden){preview.hidden=true;document.querySelector('#capture').focus()}}});
