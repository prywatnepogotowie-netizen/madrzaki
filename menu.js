/* Bystrzaki – menu na telefonie: przycisk ☰, chowanie przy przewijaniu w dół. */
(function(){
 function init(){
  var nav=document.querySelector("nav");if(!nav||nav.dataset.bzm)return;nav.dataset.bzm=1;
  var links=nav.querySelector(".links");if(!links)return;
  var s=document.createElement("style");
  s.textContent=
   "nav{transition:transform .25s ease}nav.bz-hid{transform:translateY(-110%)}"+
   ".bz-burger{display:none;margin-left:auto;border:none;background:#2b2d42;color:#fff;font:800 16px system-ui,sans-serif;padding:9px 14px;border-radius:999px;cursor:pointer}"+
   "@media(max-width:760px){"+
    "nav{flex-wrap:nowrap!important;padding:8px 12px!important}"+
    ".bz-burger{display:block}"+
    "nav .links{display:none!important;position:absolute;top:100%;left:0;right:0;margin:0!important;width:auto!important;flex-direction:column;gap:2px!important;background:#fff8ec;padding:8px 12px 14px;border-bottom:3px dashed #f1e1c0;box-shadow:0 10px 20px rgba(43,45,66,.12);max-height:75vh;overflow:auto}"+
    "nav.bz-open .links{display:flex!important}"+
    "nav .links a,nav .links a.hide-sm{display:block!important;font-size:18px!important;padding:12px 14px!important;border-radius:14px}"+
    "nav .links a:active{background:#fff}"+
   "}";
  document.head.appendChild(s);
  var b=document.createElement("button");b.type="button";b.className="bz-burger";b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Menu");
  function set(o){nav.classList.toggle("bz-open",o);b.textContent=o?"✕ Zamknij":"☰ Menu";b.setAttribute("aria-expanded",o?"true":"false")}
  set(false);nav.insertBefore(b,links);
  b.addEventListener("click",function(e){e.stopPropagation();set(!nav.classList.contains("bz-open"));nav.classList.remove("bz-hid")});
  links.addEventListener("click",function(e){if(e.target.closest("a"))set(false)});
  document.addEventListener("click",function(e){if(!nav.contains(e.target))set(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
  var last=window.pageYOffset||0,tick=false;
  window.addEventListener("scroll",function(){if(tick)return;tick=true;requestAnimationFrame(function(){
   var y=window.pageYOffset||0;
   if(nav.classList.contains("bz-open")){if(Math.abs(y-last)>40)set(false);}
   if(y>120&&y>last+6)nav.classList.add("bz-hid");else if(y<last-6||y<120)nav.classList.remove("bz-hid");
   last=y;tick=false})},{passive:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
