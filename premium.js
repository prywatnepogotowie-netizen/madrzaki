/* Bystrzaki Premium – kłódki na trudniejszych poziomach.
   Kod dostępu jest podpisany cyfrowo (ECDSA P-256) i sprawdzany w przeglądarce.
   Kod zapisujemy tylko na tym urządzeniu (localStorage). */
(function(){
 var PUB="MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIVF7x80L4wFE2uxjbw2EkJZ+R4wVFJXFEG288olTgjE+P4S9hpuf3R5jaT3UjAbV5AMGk0n0PpBpkynEKLPp+g==";
 var ON=true; // false = wszystko za darmo
 var KEY="bystrzaki-premium";
 // Co jest płatne: teksty przycisków (fragment) albo funkcja w onclick z numerem
 var LOCK={
  czytanka:{t:["Ułóż słowo","Na jaką literkę","Zdania","Zdanie i obrazek","Czytanki"]},
  liczydelko:{t:["do 100","Mnożenie","Dzielenie","Tabliczka mnożenia","Mieszanka"]},
  glowkowanie:{t:["Trudniejsze","Memory"]},
  english:{fn:[/cat\((\d+)\)/,3]},
  soroban:{t:["Tabliczka w rytmie"],fn:[/sTask\((\d+)\)/,3]},
  kalendarz:{t:["Ułóż miesiące","Pory roku"]},
  puzle:{fn:[/setLv\((2|3)\)/,0]},
  rysuj:{fn:[/open_\('(kot|rakieta|serce|zamek|dino|morze|miasto|motyl)'\)/,0]},
  szachy:{t:["Hetman","Król","Skoczek","Pionek","Bitwa pionków","Zagadki","Mini partia"]},
  zegar:{t:["Kwadranse","Co 5 minut"]},
  sklepik:{t:["Do 50 zł","Do 100 zł"]},
  kosz:{fn:[/start\('(to10|add20)'\)/,0]},
  robot:{fn:[/level\((\d+)\)/,4],lv:4}
 };
 var page=(location.pathname.match(/gry\/([a-z-]+)\.html/)||[])[1],cfg=LOCK[page];
 var inGame=!!page,base=inGame?"../":"";
 var state={ok:false,exp:null,plan:null};
 function b64u(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
 function verify(code){if(!code||!/^BZ1\./.test(code)||!window.crypto||!crypto.subtle)return Promise.resolve(null);
  var p=code.split(".");if(p.length!==3)return Promise.resolve(null);
  return crypto.subtle.importKey("spki",b64u(PUB),{name:"ECDSA",namedCurve:"P-256"},false,["verify"]).then(function(k){
   return crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},k,b64u(p[2]),b64u(p[1]))}).then(function(ok){
   if(!ok)return null;var d=JSON.parse(new TextDecoder().decode(b64u(p[1])));
   if(d.e<new Date().toISOString().slice(0,10))return {expired:true,e:d.e};return d}).catch(function(){return null})}
 function raw(){try{return localStorage.getItem(KEY)}catch(e){return null}}
 var ready=verify(raw()).then(function(d){if(d&&!d.expired){state.ok=true;state.exp=d.e;state.plan=d.p}else if(d&&d.expired)state.expired=d.e;unmark();return state});
 window.BystrzakiPremium={ready:ready,state:state,on:ON,
  activate:function(code){code=(code||"").trim().replace(/\s+/g,"");return verify(code).then(function(d){if(d&&!d.expired){try{localStorage.setItem(KEY,code)}catch(e){}state.ok=true;state.exp=d.e;state.plan=d.p;unmark()}return d})},
  clear:function(){try{localStorage.removeItem(KEY)}catch(e){}state.ok=false}};
 if(!ON||!cfg)return;
 function locked(el){if(state.ok)return false;var oc=el.getAttribute("onclick")||"",tx=(el.innerText||el.textContent||"");
  if(cfg.t&&cfg.t.some(function(w){return tx.indexOf(w)>-1}))return true;
  if(cfg.fn){var m=oc.match(cfg.fn[0]);if(m){var n=parseInt(m[1],10);return isNaN(n)?true:n>=cfg.fn[1]}}
  if(cfg.lv!=null&&el.closest&&el.closest(".levels")){var idx=[].indexOf.call(el.parentNode.children,el);return idx>=cfg.lv}
  return false}
 function mark(){if(state.ok)return;document.querySelectorAll("button,[onclick]").forEach(function(el){if(el.closest("#bzp,#bzg,#bzpp,#bzpw,#home"))return;
   var l=locked(el);if(l&&!el.classList.contains("bz-lock")){el.classList.add("bz-lock");var s=document.createElement("span");s.className="bz-lk";s.textContent="🔒";el.appendChild(s)}})}
 function unmark(){if(!state.ok)return;document.querySelectorAll(".bz-lock").forEach(function(el){el.classList.remove("bz-lock");var s=el.querySelector(".bz-lk");if(s)s.remove()})}
 function css(){var s=document.createElement("style");s.textContent=
  ".bz-lock{filter:saturate(.6)}.bz-lk{margin-left:5px;font-size:.9em;filter:none;pointer-events:none}"+
  "#bzpw{position:fixed;inset:0;z-index:10003;background:rgba(20,20,40,.55);display:flex;align-items:center;justify-content:center;padding:16px}"+
  "#bzpw .box{background:#fff;color:#2b2d42;max-width:420px;width:100%;border-radius:26px;padding:22px;text-align:center;font:17px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3)}"+
  "#bzpw h3{font-size:24px;margin:6px 0}#bzpw .big{font-size:64px}#bzpw button,#bzpw a.b{display:block;width:100%;border:none;border-radius:14px;padding:13px;font:800 18px system-ui;cursor:pointer;margin-top:10px;text-decoration:none;color:#2b2d42}"+
  "#bzpw .g{background:#06d6a0}#bzpw .y{background:#ffd166}#bzpw .n{background:#eee}#bzpw input{font:800 24px system-ui;width:120px;text-align:center;padding:8px;border-radius:12px;border:2px solid #ddd;margin-top:8px}";document.head.appendChild(s)}
 function say(t){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="pl-PL";speechSynthesis.speak(u)}catch(e){}}
 function wall(){var d=document.createElement("div");d.id="bzpw";var a=rnd(3,9),b=rnd(3,9);
  d.innerHTML='<div class="box"><div class="big">🦉🔒</div><h3>To poziom Premium</h3><p>Brawo, że chcesz więcej! Te trudniejsze zadania są w <b>Bystrzakach Premium</b>. Zawołaj rodzica 👨‍👩‍👧</p>'+
   '<button class="g" data-x="free">▶ Graj dalej za darmo</button><button class="y" data-x="parent">👨‍👩‍👧 Jestem rodzicem</button>'+
   '<div id="bzgate" style="display:none"><p style="margin:14px 0 0">Ile to <b>'+a+' × '+b+'</b>?</p><input id="bzga" inputmode="numeric" maxlength="3"><button class="g" data-x="check">Dalej</button><p id="bzgm" style="color:#c9184a;min-height:20px;margin:6px 0 0"></p></div></div>';
  document.body.appendChild(d);say("To poziom Premium. Zawołaj rodzica albo graj dalej za darmo.");
  d.addEventListener("click",function(e){var x=e.target.dataset&&e.target.dataset.x;if(e.target===d||x==="free"){d.remove();return}
   if(x==="parent"){d.querySelector("#bzgate").style.display="block";d.querySelector("#bzga").focus();return}
   if(x==="check"){if(+d.querySelector("#bzga").value===a*b){location.href=base+"premium.html"}else d.querySelector("#bzgm").textContent="Spróbuj jeszcze raz."}});}
 function rnd(a,b){return a+Math.floor(Math.random()*(b-a+1))}
 document.addEventListener("click",function(e){if(state.ok)return;var el=e.target.closest&&e.target.closest("button,[onclick]");if(!el||el.closest("#bzpw,#bzp,#bzpp,#bzg"))return;
  if(locked(el)){e.preventDefault();e.stopImmediatePropagation();wall()}},true);
 function start(){css();mark();new MutationObserver(function(){mark()}).observe(document.body,{childList:true,subtree:true})}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
