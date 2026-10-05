
(() => {
  const section=document.getElementById('clientele'),button=document.getElementById('client-pause');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,paused=false;
  function sync(){const globalReduced=document.getElementById('motion')?.getAttribute('aria-pressed')==='true';const moving=visible&&!document.hidden&&!paused&&!reduced.matches&&!globalReduced;section.classList.toggle('client-moving',moving);section.dataset.motion=moving?'running':visible?'paused':'idle';}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});observer.observe(section);
  button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume floating':'Pause floating';sync();});
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  document.addEventListener('click',event=>{if(event.target.closest('#motion'))sync();});
  sync();
})();

(function(){var g=document.getElementById('pkg-grid');if(!g)return;if(!('IntersectionObserver' in window)){g.classList.add('active');return;}new IntersectionObserver(function(e){e.forEach(function(x){g.classList.toggle('active',x.isIntersecting);});},{threshold:.15}).observe(g);})();

(()=>{
  const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function sync(){const paused=document.hidden||reduced.matches||document.getElementById('motion')?.getAttribute('aria-pressed')==='true';headings.forEach(h=>h.classList.toggle('ak-heading-still',paused));}
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>entry.target.classList.toggle('ak-heading-visible',entry.isIntersecting));},{rootMargin:'30px 0px',threshold:0});
  headings.forEach(h=>observer.observe(h));
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  document.addEventListener('click',event=>{if(event.target.closest('#motion'))sync();});
  document.addEventListener('DOMContentLoaded',sync,{once:true});sync();
})();
