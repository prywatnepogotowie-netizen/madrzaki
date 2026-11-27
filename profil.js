/* Bystrzaki – profile dzieci, wspólne gwiazdki i naklejki.
   Ładowany w <head> każdej strony, PRZED skryptem gry.
   Każdy profil ma osobne postępy: klucze gier dostają przedrostek profilu.
   Profil domyślny (p0) używa starych kluczy, więc dotychczasowe gwiazdki zostają. */
(function(){
 var S=window.localStorage;if(!S)return;
 var P=Storage.prototype,oGet=P.getItem,oSet=P.setItem,oRem=P.removeItem;
 var GAME=/^(bystrzaki-|czytanka_|liczydlo_|logika_|ratownik_)/,SHARED=/^bystrzaki-(glos|wiek|prof|premium|konto)/;
 function raw(k){try{return oGet.call(S,k)}catch(e){return null}}
 function rawSet(k,v){try{oSet.call(S,k,v)}catch(e){}}
 var list;try{list=JSON.parse(raw("bystrzaki-prof-list")||"null")}catch(e){list=null}
 if(!list||!list.length)list=[{id:"p0",n:"",a:"🦉"}];
 var cur=raw("bystrzaki-prof-cur")||"p0";if(!list.some(function(p){return p.id===cur}))cur="p0";
 function key(k){return (cur!=="p0"&&GAME.test(k)&&!SHARED.test(k))?"bz~"+cur+"~"+k:k}
 try{P.getItem=function(k){return this===S?oGet.call(S,key(k)):oGet.call(this,k)};
  P.setItem=function(k,v){return this===S?oSet.call(S,key(k),v):oSet.call(this,k,v)};
  P.removeItem=function(k){return this===S?oRem.call(S,key(k)):oRem.call(this,k)};}catch(e){}
 var STAR_KEYS=["czytanka_stars","liczydlo_stars","logika_stars","ratownik_stars","bystrzaki-soroban-stars","bystrzaki-english-stars","bystrzaki-kosz-stars","bystrzaki-robot-stars","bystrzaki-rysuj-stars","bystrzaki-szachy-stars","bystrzaki-puzle-stars","bystrzaki-zegar-stars","bystrzaki-sklepik-stars","bystrzaki-kalendarz-stars"];
 function starsOf(k){return +(S.getItem(k)||0)||0}
 function total(){return STAR_KEYS.reduce(function(a,k){return a+starsOf(k)},0)}
 function bonus(){return +(S.getItem("bystrzaki-bonus")||0)||0}
 function unlocked(){return Math.min(48,Math.floor(total()/3)+bonus())}
 var me=function(){return list.filter(function(p){return p.id===cur})[0]};
 window.Bystrzaki={list:function(){return list},current:me,starKeys:STAR_KEYS,starsOf:starsOf,total:total,unlocked:unlocked,bonus:bonus,
  addBonus:function(){S.setItem("bystrzaki-bonus",bonus()+1)},
  switchTo:function(id){rawSet("bystrzaki-prof-cur",id);location.reload()},
  add:function(n,a){var id="p"+Date.now().toString(36);list.push({id:id,n:n,a:a});rawSet("bystrzaki-prof-list",JSON.stringify(list));rawSet("bystrzaki-prof-cur",id);location.reload()},
  rename:function(n,a){var p=me();p.n=n;p.a=a;rawSet("bystrzaki-prof-list",JSON.stringify(list))},
  remove:function(id){if(id==="p0")return;list=list.filter(function(p){return p.id!==id});rawSet("bystrzaki-prof-list",JSON.stringify(list));
   for(var i=S.length-1;i>=0;i--){var k=S.key(i);if(k&&k.indexOf("bz~"+id+"~")===0)oRem.call(S,k)}if(cur===id)rawSet("bystrzaki-prof-cur","p0");location.reload()}};
 var AV=["🦉","🦊","🐻","🐼","🐯","🦁","🐸","🐵","🐰","🐶","🐱","🦄","🐲","🤖","🚀","⚽","🏀","🦖"];
 var inGame=/\/gry\//.test(location.pathname),base=inGame?"../":"";
 function css(){var s=document.createElement("style");s.textContent=
  "#bzp{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:9998;background:#fff;color:#2b2d42;border:none;border-radius:999px;padding:6px 14px 6px 8px;font:700 15px system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.2);cursor:pointer;display:flex;align-items:center;gap:6px;max-width:42vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
  "#bzp .a{font-size:24px}#bzpp{position:fixed;inset:0;z-index:10001;background:rgba(20,20,40,.5);display:flex;align-items:flex-end;justify-content:center}"+
  "#bzpp .box{background:#fff;color:#2b2d42;width:min(520px,100%);max-height:88vh;overflow:auto;border-radius:24px 24px 0 0;padding:18px;font:16px system-ui,sans-serif}"+
  "#bzpp h3{margin:0 0 10px;font-size:22px}#bzpp .pr{display:flex;align-items:center;gap:10px;padding:10px;border-radius:14px;border:2px solid #eee;margin:6px 0;cursor:pointer}"+
  "#bzpp .pr.on{border-color:#06d6a0;background:#eafff7}#bzpp .pr .a{font-size:32px}#bzpp .pr b{flex:1}#bzpp .pr small{color:#6b7090}"+
  "#bzpp .av{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}#bzpp .av button{font-size:28px;border:2px solid #eee;background:#fff;border-radius:12px;width:48px;height:48px;cursor:pointer}#bzpp .av button.on{border-color:#06d6a0;background:#eafff7}"+
  "#bzpp input{font:700 20px system-ui;padding:10px;border-radius:12px;border:2px solid #ddd;width:100%}#bzpp .go{width:100%;border:none;border-radius:14px;padding:12px;font:800 18px system-ui;cursor:pointer;margin-top:8px;background:#06d6a0}"+
  "#bzpp .gr{background:#eee}#bzpp .del{border:none;background:none;color:#c9184a;font-size:13px;cursor:pointer}"+
  "*{touch-action:manipulation}html{-webkit-text-size-adjust:100%}body{padding-bottom:84px!important}"+"#bzbar{position:fixed;left:0;right:0;bottom:0;height:64px;z-index:9990;background:rgba(255,255,255,.96);box-shadow:0 -2px 10px rgba(0,0,0,.08)}"+"#home{bottom:10px!important;left:10px!important}#bzg{bottom:10px!important;right:10px!important}"+"@media(max-width:560px){#home,#bzg{width:46px;max-width:46px;overflow:hidden;white-space:nowrap;padding:10px 0 10px 13px!important}#bzp{max-width:56vw;font-size:14px}#bzback{padding:9px 11px;border-radius:50%;font-size:18px;margin-right:2px}#bzback .bzt{display:none}}"+"#bzback{border:none;background:#2b2d42;color:#fff;border-radius:14px;padding:8px 12px;line-height:1;font:800 16px system-ui,sans-serif;cursor:pointer;margin-right:4px;flex:none}"+"#bzt{position:fixed;left:50%;top:18px;transform:translateX(-50%) scale(.6);opacity:0;z-index:10002;background:#2b2d42;color:#ffd166;padding:12px 18px;border-radius:18px;font:800 18px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:all .35s;text-decoration:none}"+
  "#bzt.on{opacity:1;transform:translateX(-50%) scale(1)}@media print{#bzp,#bzt{display:none}}";document.head.appendChild(s)}
 function chip(){css();var p=me(),b=document.createElement("button");b.id="bzp";b.type="button";
  b.innerHTML='<span class="a">'+p.a+'</span>'+(p.n?p.n:"Kto gra?")+' · ⭐'+total();b.onclick=openPanel;document.body.appendChild(b)}
 function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
 function openPanel(){var p=me(),d=document.createElement("div");d.id="bzpp";var pick=p.a;
  var h='<div class="box"><h3>👋 Kto teraz gra?</h3>';
  list.forEach(function(q){var t=q.id===cur?total():null;h+='<div class="pr'+(q.id===cur?" on":"")+'" data-id="'+q.id+'"><span class="a">'+q.a+'</span><b>'+esc(q.n||"Bez imienia")+'</b>'+(t!==null?'<small>⭐ '+t+'</small>':"")+(q.id!=="p0"?'<button class="del" data-del="'+q.id+'">usuń</button>':"")+'</div>'});
  h+='<h3 style="margin-top:14px">'+(p.n?"✏️ Zmień ksywkę i obrazek":"✏️ Jak masz na imię?")+'</h3><input id="bzn" maxlength="14" placeholder="ksywka, np. Leoś" value="'+esc(p.n)+'"><div class="av">'+AV.map(function(a){return '<button data-a="'+a+'" class="'+(a===pick?"on":"")+'">'+a+'</button>'}).join("")+'</div>'+
   '<button class="go" id="bzsave">✅ Zapisz</button><button class="go gr" id="bznew">➕ Dodaj nowe dziecko</button>'+
   '<p style="font-size:13px;color:#6b7090;margin-top:10px">Każde dziecko ma swoje gwiazdki, naklejki i postępy w grach. Zapisujemy tylko ksywkę i obrazek, wyłącznie na tym urządzeniu. Nie podawaj nazwiska.</p>'+
   '<a href="'+base+'album.html" style="display:block;text-align:center;font-weight:800;margin-top:6px">⭐ Otwórz album naklejek i mapę przygody</a></div>';
  d.innerHTML=h;document.body.appendChild(d);
  d.addEventListener("click",function(e){var t=e.target;if(t===d){d.remove();return}
   if(t.dataset&&t.dataset.del){e.stopPropagation();if(confirmDel(t.dataset.del))Bystrzaki.remove(t.dataset.del);return}
   var pr=t.closest&&t.closest(".pr");if(pr&&pr.dataset.id!==cur){Bystrzaki.switchTo(pr.dataset.id);return}
   if(t.dataset&&t.dataset.a){pick=t.dataset.a;d.querySelectorAll(".av button").forEach(function(x){x.classList.toggle("on",x===t)});return}
   if(t.id==="bzsave"){Bystrzaki.rename(d.querySelector("#bzn").value.trim(),pick);location.reload();return}
   if(t.id==="bznew"){var n=d.querySelector("#bzn").value.trim();if(!n||n===p.n){d.querySelector("#bzn").value="";d.querySelector("#bzn").placeholder="Wpisz ksywkę nowego dziecka";d.querySelector("#bzn").focus();d.querySelector("#bznew").textContent="➕ Dodaj to dziecko";d.querySelector("#bznew").onclick=function(){var nn=d.querySelector("#bzn").value.trim();if(nn)Bystrzaki.add(nn,pick)};return}}});}
 function confirmDel(id){var q=list.filter(function(x){return x.id===id})[0];var b=document.querySelector("#bzpp .box");
  if(b&&!b.dataset.ask){b.dataset.ask=id;var m=document.createElement("p");m.style.cssText="color:#c9184a;font-weight:800";m.textContent="Usunąć "+(q.n||"profil")+" i wszystkie postępy? Kliknij „usuń” jeszcze raz.";b.prepend(m);return false}
  return b&&b.dataset.ask===id}
 var seen=null;
 function toast(n){var a=document.getElementById("bzt");if(!a){a=document.createElement("a");a.id="bzt";a.href=base+"album.html";document.body.appendChild(a)}
  a.textContent="🎉 Nowa naklejka w albumie! ("+n+"/48)";a.classList.add("on");setTimeout(function(){a.classList.remove("on")},4500)}
 function tick(){var u=unlocked();if(seen===null){seen=+(S.getItem("bystrzaki-seen")||u);if(u>seen){toast(u);}seen=u;S.setItem("bystrzaki-seen",u);return}
  if(u>seen){seen=u;S.setItem("bystrzaki-seen",u);toast(u);var c=document.getElementById("bzp");if(c)c.lastChild&&(c.innerHTML='<span class="a">'+me().a+'</span>'+(me().n||"Kto gra?")+' · ⭐'+total())}}
 function bar(){if(!document.getElementById("bzbar")){var d=document.createElement("div");d.id="bzbar";document.body.appendChild(d)}}
 function back(){if(!inGame)return;var h=document.querySelector("header");if(!h||document.getElementById("bzback"))return;var b=document.createElement("button");b.id="bzback";b.type="button";b.innerHTML="⬅<span class=\"bzt\"> Menu</span>";b.setAttribute("aria-label","Wróć do menu gry");
  b.onclick=function(e){e.stopPropagation();try{speechSynthesis.cancel()}catch(_){}document.querySelectorAll("#bzpw,#bzpp,#bzgp").forEach(function(x){x.remove()});if(typeof window.menu==="function"&&!window.__bzAtMenu){try{window.menu()}catch(_){}window.__bzAtMenu=true;window.scrollTo(0,0)}else location.href="../index.html"};h.insertBefore(b,h.firstChild)}
 function start(){bar();back();window.__bzAtMenu=true;document.addEventListener("click",function(e){if(!e.target.closest("#bzback,#bzbar,#bzp,#home,#bzg,#bzgl,#bzpw,#bzpp,#bzgp,#bzt"))window.__bzAtMenu=false},true);chip();tick();setInterval(tick,2500);
  // zadanie dnia: zapisz stan gwiazdek na początku dnia
  var day=new Date().toISOString().slice(0,10),snap;try{snap=JSON.parse(S.getItem("bystrzaki-day")||"null")}catch(e){snap=null}
  if(!snap||snap.d!==day){var st={};STAR_KEYS.forEach(function(k){st[k]=starsOf(k)});S.setItem("bystrzaki-day",JSON.stringify({d:day,s:st,done:0}))}}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
