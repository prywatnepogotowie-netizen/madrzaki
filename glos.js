/* Bystrzaki – wybór głosu lektora dla wszystkich gier.
   Zapisuje wybór w localStorage i podmienia głos w każdej polskiej wypowiedzi. */
(function(){
 if(!("speechSynthesis" in window))return;
 var KEY="bystrzaki-glos",cfg={};
 try{cfg=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch(e){}}
 function plVoices(){return speechSynthesis.getVoices().filter(function(v){return /^pl/i.test(v.lang)})}
 function def(){var l=plVoices();function sc(v){var n=(v.name+" "+(v.voiceURI||"")).toLowerCase(),r=0;if(/premium/.test(n))r+=90;if(/enhanced|rozszerz|natural|neural/.test(n))r+=70;if(/google/.test(n))r+=60;if(/eloquence|novelty|compact/.test(n))r-=30;return r}l=l.slice().sort(function(a,b){return sc(b)-sc(a)});return l.length&&sc(l[0])>0?l[0]:null}
 function chosen(){if(!cfg.name)return def();var v=plVoices().filter(function(x){return x.name===cfg.name});return v[0]||def()}
 var orig0=speechSynthesis.speak.bind(speechSynthesis),oCancel=speechSynthesis.cancel.bind(speechSynthesis),lastCancel=0,keep=[];
 // iOS/Safari: mowa ucina się, gdy speak() idzie zaraz po cancel(), albo gdy przeglądarka „zgubi” wypowiedź z pamięci
 function orig(u){keep.push(u);if(keep.length>8)keep.shift();var wait=Date.now()-lastCancel<160?170:0;
  if(wait)setTimeout(function(){orig0(u)},wait);else orig0(u);try{if(speechSynthesis.paused)speechSynthesis.resume()}catch(e){}}
 try{speechSynthesis.cancel=function(){lastCancel=Date.now();try{stopRec()}catch(e){}return oCancel()}}catch(e){}
 try{speechSynthesis.speak=function(u){
  var hs=null;try{hs=recCan(u)}catch(e){}
  if(!hs){try{if(!u.lang||/^pl/i.test(u.lang)){var v=chosen();if(v)u.voice=v;if(cfg.rate)u.rate=Math.max(.5,Math.min(1.6,(u.rate||1)*cfg.rate));if(cfg.pitch)u.pitch=cfg.pitch;}}catch(e){}}
  Q.push({u:u,hs:hs});playNext()}}catch(e){}

 // ---- Nagrany głos Cioci Mądrali (Google Chirp HD), z plików /glos/ ----
 var BASE=(document.currentScript&&document.currentScript.src||"").replace(/glos\.js.*$/,"")||"/";
 var MAN=null,SH={},SHL={},NSH=32,AU=null,Q=[],CUR=null,GEN=0;
 function recOn(){return !cfg.sys}
 function nrm(t){return String(t||"").replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2B00}-\u{2BFF}]/gu,"").replace(/\s+/g," ").trim()}
 function sents(t){return nrm(t).replace(/([.!?…])\s+/g,"$1\n").split("\n").map(function(x){return x.trim()}).filter(Boolean)}
 function hh(s){var h=0x811c9dc5;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return ("0000000"+h.toString(16)).slice(-8)}
 function shardOf(h){return MAN[h][0]}
 var PRI={};["m.json?v=3","m2.json?v=3","m3.json?v=4"].forEach(function(f,pi){try{fetch(BASE+"glos/"+f).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.i){MAN=MAN||{};for(var k in j.i){if(!(PRI[k]>pi)){MAN[k]=j.i[k];PRI[k]=pi}}}}).catch(function(){})}catch(e){}});
 function loadShard(n){if(SH[n])return Promise.resolve(SH[n]);if(SHL[n])return SHL[n];
  SHL[n]=fetch(BASE+"glos/"+(typeof n==="number"?"s"+n:n)+".bin?v=2").then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(b){SH[n]=b;return b});SHL[n].catch(function(){SHL[n]=null});return SHL[n]}
 var SIL="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAABQAAAqAAbW1tbW1tbW1tbW1tbW1tbW1tbZKSkpKSkpKSkpKSkpKSkpKSkpKStra2tra2tra2tra2tra2tra2trbb29vb29vb29vb29vb29vb29vb2///////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQEUAAAAAAAAAKgvT9A1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
 function unlock(){if(unlock.d)return;unlock.d=1;try{if(!AU){AU=new Audio();AU.preload="auto"}if(!CUR){AU.src=SIL;var p=AU.play();if(p&&p.catch)p.catch(function(){unlock.d=0})}}catch(e){unlock.d=0}}
 ["touchend","click","keydown"].forEach(function(ev){document.addEventListener(ev,unlock,true)});
 function stopRec(){GEN++;Q=[];if(AU){try{AU.pause()}catch(e){}}CUR=null}
 function recCan(u){if(!recOn()||!MAN)return null;try{if(u.lang&&!/^pl/i.test(u.lang))return null}catch(e){}
  var ss=sents(u.text);if(!ss.length)return null;var hs=[];for(var i=0;i<ss.length;i++){var h=hh(ss[i].toLowerCase());if(!MAN[h])return null;hs.push(h)}return hs}
 function fire(u,ev){try{if(typeof u["on"+ev]==="function")u["on"+ev]({type:ev,utterance:u})}catch(e){}}
 function ttsItem(it,g){var done=false;function fin(){if(done)return;done=true;if(g!==GEN)return;CUR=null;playNext()}
  try{it.u.addEventListener("end",fin);it.u.addEventListener("error",fin)}catch(e){}
  setTimeout(fin,Math.min(20000,1800+String(it.u.text||"").length*120/(it.u.rate||1)));orig(it.u)}
 function playNext(){if(CUR||!Q.length)return;var it=Q.shift();CUR=it;var g=GEN;
  if(!it.hs){ttsItem(it,g);return}
  Promise.all(it.hs.map(function(h){return loadShard(shardOf(h))})).then(function(){if(g!==GEN)return;
   if(!AU){AU=new Audio();AU.preload="auto"}var k=0;fire(it.u,"start");
   function step(){if(g!==GEN)return;if(k>=it.hs.length){CUR=null;fire(it.u,"end");playNext();return}
    var h=it.hs[k++],e=MAN[h],buf=SH[e[0]];if(!buf){step();return}if(AU.__u)try{URL.revokeObjectURL(AU.__u)}catch(x){}AU.__u=URL.createObjectURL(new Blob([buf.slice(e[1],e[1]+e[2])],{type:"audio/mpeg"}));AU.src=AU.__u;try{var rr=(it.u.rate||1)/0.95;AU.playbackRate=Math.max(.6,Math.min(1.4,rr))*(cfg.rate||1)}catch(x){}
    AU.onended=function(){setTimeout(step,k<it.hs.length?120:0)};var p=AU.play();if(p&&p.catch)p.catch(function(){if(g!==GEN)return;it.hs=null;ttsItem(it,g)})}
   step()}).catch(function(){if(g!==GEN)return;it.hs=null;ttsItem(it,g)})}
 var SAMPLE="Cześć! Jestem Ciocia Mądrala. Zagramy razem?";
 function css(){if(document.getElementById("bz-glos-css"))return;var s=document.createElement("style");s.id="bz-glos-css";
  s.textContent="#bzg{position:fixed;right:12px;bottom:12px;z-index:9999;background:#2b2d42;color:#fff;border:none;font:700 15px system-ui,sans-serif;padding:10px 14px;border-radius:999px;box-shadow:0 4px 10px rgba(0,0,0,.25);cursor:pointer}"+
  "#bzgp{position:fixed;inset:0;z-index:10000;background:rgba(20,20,40,.5);display:flex;align-items:flex-end;justify-content:center}"+
  "#bzgp .box{background:#fff;color:#2b2d42;width:min(520px,100%);max-height:85vh;overflow:auto;border-radius:24px 24px 0 0;padding:18px;font:16px system-ui,sans-serif}"+
  "#bzgp h3{margin:0 0 6px;font-size:22px}#bzgp .v{display:flex;align-items:center;gap:8px;padding:10px;border-radius:14px;border:2px solid #eee;margin:6px 0;cursor:pointer}"+
  "#bzgp .v.on{border-color:#06d6a0;background:#eafff7}#bzgp .v span{flex:1}#bzgp .v small{color:#6b7090;display:block}"+
  "#bzgp button.p{border:none;background:#4cc9f0;border-radius:10px;padding:8px 10px;font-size:18px;cursor:pointer}"+
  "#bzgp .row{display:flex;gap:10px;align-items:center;margin:10px 0}#bzgp input[type=range]{flex:1}"+
  "#bzgp .ok{width:100%;border:none;background:#06d6a0;border-radius:14px;padding:12px;font:800 18px system-ui;cursor:pointer;margin-top:8px}"+
  "#bzgp .hint{font-size:14px;color:#6b7090;line-height:1.45;background:#f6f7fb;border-radius:12px;padding:10px}"+
  "@media print{#bzg{display:none}}";document.head.appendChild(s)}
 function label(v){var n=v.name+" "+(v.voiceURI||""),t=[];if(/premium/i.test(n))t.push("bardzo naturalny");else if(/enhanced|natural|neural|online/i.test(n))t.push("naturalny");if(/google/i.test(n))t.push("Google · domyślny");
  if(/krzysztof|jacek|marek|male|męsk/i.test(n))t.push("męski");else if(/zosia|ewa|paulina|agnieszka|maja|female|zofia|marta/i.test(n))t.push("kobiecy");return t.join(" · ")}
 function speak(v,txt){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(txt||SAMPLE);u.lang="pl-PL";u.voice=v;u.rate=cfg.rate||1;u.pitch=cfg.pitch||1;orig(u)}
 function open(){css();var list=plVoices(),cur=chosen();if(!list.length&&!open.waited){open.waited=1;speechSynthesis.getVoices();setTimeout(function(){var o=document.getElementById("bzgp");if(o){o.remove();open()}},900)}
  var p=document.createElement("div");p.id="bzgp";
  var h='<div class="box"><h3>🗣️ Wybierz głos lektora</h3><p style="margin:0 0 8px">Dotknij głosu, żeby go posłuchać i wybrać.</p>';
  
  h+='<div class="v'+(recOn()?" on":"")+'" data-rec="1"><span><b>🦉 Ciocia Mądrala</b><small>nagrany, naturalny głos · polecany · działa na każdym telefonie</small></span><button class="p" data-rec="1">▶</button></div>';
  list.forEach(function(v,i){h+='<div class="v'+((!recOn()&&cur&&cur.name===v.name)?" on":"")+'" data-i="'+i+'"><span><b>'+v.name.replace(/\(.*?\)/g,"").trim()+'</b><small>'+(label(v)||"standardowy")+'</small></span><button class="p" data-i="'+i+'">▶</button></div>'});
  h+='<div class="row">🐢<input type="range" id="bzr" min="0.7" max="1.3" step="0.05" value="'+(cfg.rate||1)+'">🐇</div>'+
   '<div class="row">⬇ niżej<input type="range" id="bzt" min="0.8" max="1.2" step="0.05" value="'+(cfg.pitch||1)+'">wyżej ⬆</div>'+
   '<p class="hint"><b>Więcej ładnych głosów:</b><br>Mac: Ustawienia systemowe → Dostępność → Treść mówiona → Głos systemowy → Zarządzaj głosami → Polski → pobierz <b>Zosia (Premium)</b> lub <b>Krzysztof</b>. Potem odśwież stronę.<br>iPhone / iPad: Ustawienia → Dostępność → Treść mówiona → Głosy → Polski → pobierz <b>Zosia (Rozszerzony)</b> lub <b>Premium</b>, a potem wybierz ją tutaj.<br>Android: Ustawienia → Zamiana tekstu na mowę → Usługi Google → zainstaluj polskie głosy.</p>'+
   '<button class="ok">✅ Gotowe</button><button class="ok" style="background:#eee;margin-top:6px" id="bzreset">Przywróć domyślny</button></div>';
  p.innerHTML=h;document.body.appendChild(p);
  p.addEventListener("click",function(e){var t=e.target;if(t===p||t.classList.contains("ok")&&t.id!=="bzreset"){p.remove();return}
   if(t.id==="bzreset"){cfg={};save();p.remove();return}
   var row=t.closest(".v");if(row&&row.dataset.rec){delete cfg.sys;save();p.querySelectorAll(".v").forEach(function(x){x.classList.toggle("on",x===row)});speechSynthesis.cancel();var uu=new SpeechSynthesisUtterance(SAMPLE);uu.lang="pl-PL";speechSynthesis.speak(uu);return}
   if(row){var v=list[+row.dataset.i];cfg.name=v.name;cfg.sys=1;save();p.querySelectorAll(".v").forEach(function(x){x.classList.toggle("on",x===row)});speak(v);}});
  p.querySelector("#bzr").oninput=function(){cfg.rate=+this.value;save()};
  p.querySelector("#bzr").onchange=p.querySelector("#bzt").onchange=function(){speechSynthesis.cancel();var uu=new SpeechSynthesisUtterance("Tak teraz mówię.");uu.lang="pl-PL";speechSynthesis.speak(uu)};
  p.querySelector("#bzt").oninput=function(){cfg.pitch=+this.value;save()};}
 function btn(){css();if(document.getElementById("bzg"))return;var b=document.createElement("button");b.id="bzg";b.type="button";b.textContent="🗣️ Głos";b.onclick=open;document.body.appendChild(b)}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",btn);else btn();
 speechSynthesis.getVoices();
})();
