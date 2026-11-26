/* Bystrzaki – wybór głosu lektora dla wszystkich gier.
   Zapisuje wybór w localStorage i podmienia głos w każdej polskiej wypowiedzi. */
(function(){
 if(!("speechSynthesis" in window))return;
 var KEY="bystrzaki-glos",cfg={};
 try{cfg=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch(e){}}
 function plVoices(){return speechSynthesis.getVoices().filter(function(v){return /^pl/i.test(v.lang)})}
 function chosen(){if(!cfg.name)return null;var v=plVoices().filter(function(x){return x.name===cfg.name});return v[0]||null}
 var orig=speechSynthesis.speak.bind(speechSynthesis);
 try{speechSynthesis.speak=function(u){
  try{if(!u.lang||/^pl/i.test(u.lang)){var v=chosen();if(v)u.voice=v;if(cfg.rate)u.rate=Math.max(.5,Math.min(1.6,(u.rate||1)*cfg.rate));if(cfg.pitch)u.pitch=cfg.pitch;}}catch(e){}
  return orig(u);}}catch(e){}
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
 function label(v){var n=v.name,t=[];if(/premium/i.test(n))t.push("bardzo naturalny");else if(/enhanced|natural|neural|online/i.test(n))t.push("naturalny");if(/google/i.test(n))t.push("Google");
  if(/krzysztof|jacek|marek|male|męsk/i.test(n))t.push("męski");else if(/zosia|ewa|paulina|agnieszka|maja|female|zofia|marta/i.test(n))t.push("kobiecy");return t.join(" · ")}
 function speak(v,txt){speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(txt||SAMPLE);u.lang="pl-PL";u.voice=v;u.rate=cfg.rate||1;u.pitch=cfg.pitch||1;orig(u)}
 function open(){css();var list=plVoices(),cur=chosen();
  var p=document.createElement("div");p.id="bzgp";
  var h='<div class="box"><h3>🗣️ Wybierz głos lektora</h3><p style="margin:0 0 8px">Dotknij głosu, żeby go posłuchać i wybrać.</p>';
  if(!list.length)h+='<p class="hint">To urządzenie nie ma jeszcze polskiego głosu. Instrukcja poniżej.</p>';
  list.forEach(function(v,i){h+='<div class="v'+((cur&&cur.name===v.name)?" on":"")+'" data-i="'+i+'"><span><b>'+v.name.replace(/\(.*?\)/g,"").trim()+'</b><small>'+(label(v)||"standardowy")+'</small></span><button class="p" data-i="'+i+'">▶</button></div>'});
  h+='<div class="row">🐢<input type="range" id="bzr" min="0.7" max="1.3" step="0.05" value="'+(cfg.rate||1)+'">🐇</div>'+
   '<div class="row">⬇ niżej<input type="range" id="bzt" min="0.8" max="1.2" step="0.05" value="'+(cfg.pitch||1)+'">wyżej ⬆</div>'+
   '<p class="hint"><b>Więcej ładnych głosów:</b><br>Mac: Ustawienia systemowe → Dostępność → Treść mówiona → Głos systemowy → Zarządzaj głosami → Polski → pobierz <b>Zosia (Premium)</b> lub <b>Krzysztof</b>. Potem odśwież stronę.<br>iPhone / iPad: Ustawienia → Dostępność → Treść mówiona → Głosy → Polski.<br>Android: Ustawienia → Zamiana tekstu na mowę → Usługi Google → zainstaluj polskie głosy.</p>'+
   '<button class="ok">✅ Gotowe</button><button class="ok" style="background:#eee;margin-top:6px" id="bzreset">Przywróć domyślny</button></div>';
  p.innerHTML=h;document.body.appendChild(p);
  p.addEventListener("click",function(e){var t=e.target;if(t===p||t.classList.contains("ok")&&t.id!=="bzreset"){p.remove();return}
   if(t.id==="bzreset"){cfg={};save();p.remove();return}
   var row=t.closest(".v");if(row){var v=list[+row.dataset.i];cfg.name=v.name;save();p.querySelectorAll(".v").forEach(function(x){x.classList.toggle("on",x===row)});speak(v);}});
  p.querySelector("#bzr").oninput=function(){cfg.rate=+this.value;save()};
  p.querySelector("#bzr").onchange=p.querySelector("#bzt").onchange=function(){var v=chosen()||list[0];if(v)speak(v,"Tak teraz mówię.")};
  p.querySelector("#bzt").oninput=function(){cfg.pitch=+this.value;save()};}
 function btn(){css();if(document.getElementById("bzg"))return;var b=document.createElement("button");b.id="bzg";b.type="button";b.textContent="🗣️ Głos";b.onclick=open;document.body.appendChild(b)}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",btn);else btn();
 speechSynthesis.getVoices();
})();
