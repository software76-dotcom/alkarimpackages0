(() => {
  'use strict';
  const config=window.siteConfig||{};
  const id=/^G-[A-Z0-9]{6,20}$/.test(config.analyticsId||'')?config.analyticsId:'';
  const key='alkarim-consent-v1',ttl=180*24*60*60*1000;
  const panel=document.getElementById('cookie-consent');if(!panel)return;
  let priorFocus=null,loaded=false,choice=null;
  const read=()=>{try{const item=JSON.parse(localStorage.getItem(key));return item?.version===1&&item.scope===id&&typeof item.analytics==='boolean'&&Number.isFinite(item.at)&&item.at<=Date.now()&&Date.now()-item.at<ttl?item:null}catch{return null}};
  choice=read();
  const allowed=()=>choice?.analytics===true&&Date.now()-choice.at<ttl;
  function enable(){
    if(!id||loaded||!allowed())return;loaded=true;
    window['ga-disable-'+id]=false;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000,cookie_flags:'SameSite=Lax;Secure',ignore_referrer:true,page_location:location.origin+location.pathname,page_referrer:''});
    window.gtag('event','page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:''});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;script.id='analytics-tag';document.head.appendChild(script);
  }
  function clearAnalytics(){
    if(id)window['ga-disable-'+id]=true;
    const labels=location.hostname.split('.');const domains=[''];
    for(let i=0;i<labels.length-1;i++)domains.push(labels.slice(i).join('.'),'.'+labels.slice(i).join('.'));
    for(const cookie of document.cookie.split(';')){const name=cookie.split('=')[0].trim();if(!/^_ga(?:_|$)|^_gid$|^_gat/.test(name))continue;for(const domain of domains)document.cookie=name+'=; Max-Age=0; Path=/; SameSite=Lax'+(domain?'; Domain='+domain:'');}
  }
  window.siteTrack=name=>{
    if(!id||!allowed()||!loaded)return;
    const events=['quote_click','email_click','phone_click','directions_click','studio_enabled','studio_open','format_compare','capture_view','download_capture'];
    if(events.includes(name))window.gtag('event',name,{page_location:location.origin+location.pathname,page_referrer:''});
  };
  function close(){panel.hidden=true;if(priorFocus)priorFocus.focus();}
  function save(analytics){
    choice={version:1,scope:id,analytics,at:Date.now()};let saved=true;
    try{localStorage.setItem(key,JSON.stringify(choice))}catch{saved=false}
    if(analytics)enable();else clearAnalytics();
    close();
    const feedback=document.getElementById('consent-feedback');if(feedback)feedback.textContent=saved?'Cookie preferences saved.': 'Preferences apply for this page. Your browser could not save them.';
    if(!analytics&&loaded)location.reload();
  }
  document.getElementById('accept-analytics').addEventListener('click',()=>save(true));
  document.getElementById('reject-analytics').addEventListener('click',()=>save(false));
  document.getElementById('close-consent').addEventListener('click',close);
  document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{priorFocus=button;panel.hidden=false;document.getElementById('reject-analytics').focus()}));
  panel.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  document.addEventListener('click',e=>{
    const target=e.target.closest('a,button');if(!target)return;
    const href=target.getAttribute('href')||'';
    const event=target.dataset.event||(href.startsWith('mailto:')?'email_click':href.startsWith('tel:')?'phone_click':target.classList.contains('directions-link')?'directions_click':({'open-box':'studio_open',format:'format_compare',capture:'capture_view','download-capture':'download_capture'})[target.id]);
    if(event)window.siteTrack(event);
  });
  window.addEventListener('storage',e=>{if(e.key!==key)return;choice=read();if(!allowed()){clearAnalytics();if(loaded)location.reload()}else enable();});
  if(!choice)panel.hidden=false;
  if(!id)document.getElementById('analytics-availability').textContent='Optional analytics is currently disabled. Your choice will be remembered on this browser for up to six months.';
  if(!allowed())clearAnalytics();else enable();
  setInterval(()=>{if(loaded&&!allowed()){clearAnalytics();location.reload()}},60000);
})();
