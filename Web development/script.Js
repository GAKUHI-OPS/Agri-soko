const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const kes=n=>"KES "+Number(n).toLocaleString("en-KE");
const ls={g:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const PRICES=[["Maize","90 kg bag",3200,2.4],["Dry beans","90 kg bag",9800,-1.1],["Wheat","90 kg bag",4600,0.8],["Rice (paddy)","50 kg bag",4100,1.6],["Irish potatoes","50 kg bag",2800,-3.2],["Tomatoes","64 kg crate",4500,5.1],["Kale (sukuma wiki)","Bunch",15,0],["Onions","13 kg net",1300,2],["Milk","Litre",55,.5],["Eggs","Tray of 30",460,1.3],["Avocado (Hass)","Kg",60,-2],["Coffee (cherry)","Kg",95,3.4]];
const SHOP=[[1,"Jembe (hoe)","Kilimo Agrovet",650],[2,"Knapsack sprayer 20L","GreenField Agrovet",3800],[3,"Electric water pump","Shamba Supplies",21500],[4,"Wheelbarrow","Kilimo Agrovet",5200],[5,"Hedge shears","GreenField Agrovet",950],[6,"DAP fertilizer 50 kg","Shamba Supplies",4800],[7,"Hybrid maize seed 2 kg","Kilimo Agrovet",720],[8,"Drip irrigation kit (¼ acre)","GreenField Agrovet",12500],[9,"Panga (machete)","Kilimo Agrovet",450],[10,"Poultry drinker","Shamba Supplies",800],[11,"Gumboots","GreenField Agrovet",1200],[12,"Greenhouse polythene 4 m","Shamba Supplies",8900],[13,"Claw hammer 20 oz","Kilimo Agrovet",1100]];
const SEED=[{id:"s1",p:"Maize",q:40,u:"bag",pr:3100,loc:"Eldoret",by:"Wanjiru K.",ph:"0712000111"},{id:"s2",p:"Tomatoes",q:25,u:"crate",pr:4300,loc:"Kirinyaga",by:"Otieno M.",ph:"0722000222"},{id:"s3",p:"Fresh milk",q:120,u:"litre",pr:52,loc:"Nyeri",by:"Mary N.",ph:"0733000333"}];
const PAGE=document.body.dataset.page||"home";
let me=ls.g("ag_me",null),cart=ls.g("ag_cart",[]),listings=ls.g("ag_list",[]),cur=ls.g("ag_cur","prices"),reg=false,cancelled=false;

const FOLDER="PHOTOS";   // your folder, next to index.html

// TYPE YOUR OWN FILE NAMES on the right, exactly as saved in your photo folder ("" = no photo)
const MY_PHOTOS={
 "Maize":"maize.jpg",
 "Dry beans":"dry-beans.jpg",
 "Wheat":"wheat.jpg",
 "Rice (paddy)":"rice.jpg",
 "Irish potatoes":"potatoes.jpg",
 "Tomatoes":"tomatoes.jpg",
 "Kale (sukuma wiki)":"kale.jpg",
 "Onions":"onions.jpg",
 "Milk":"milk.jpg",
 "Fresh milk":"freshmilk.jpg",
 "Eggs":"eggs.jpg",
 "Avocado (Hass)":"avocado.jpg",
 "Coffee (cherry)":"coffee.jpg",
 "Jembe (hoe)":"jembe-hoe.jpg",
 "Knapsack sprayer 20L":"knapsack-sprayer.jpg",
 "Electric water pump":"electric-water-pump.jpg",
 "Wheelbarrow":"wheelbarrow.jpg",
 "Hedge shears":"hedge-shears.jpg",
 "DAP fertilizer 50 kg":"dap-fertilizer.jpg",
 "Hybrid maize seed 2 kg":"hybrid-maize-seed.jpg",
 "Drip irrigation kit (¼ acre)":"drip-irrigation-kit.jpg",
 "Panga (machete)":"panga-machete.jpg",
 "Poultry drinker":"poultry-drinker.jpg",
 "Gumboots":"gumboots.jpg",
 "Greenhouse polythene 4 m":"greenhouse-polythene.jpg",
 "Claw hammer 20 oz":"claw-hammer.jpg"
};

const NOPIC="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 125"><rect width="200" height="125" fill="#e5e7eb"/><text x="100" y="68" font-size="14" text-anchor="middle" fill="#6b7280" font-family="sans-serif">No photo</text></svg>');
const pic=(n,c)=>{const L=n.toLowerCase(),ks=Object.keys(MY_PHOTOS).filter(k=>MY_PHOTOS[k]),k=ks.find(x=>x===n)||ks.find(x=>x.toLowerCase().includes(L))||ks.find(x=>L.includes(x.toLowerCase().split(/[ (]/)[0])),f=k&&MY_PHOTOS[k],sm=c.startsWith("th"),st=(sm?"width:42px;height:42px;margin-right:10px;border-radius:8px;":"display:block;width:100%;height:170px;margin-bottom:10px;border-radius:10px;border:1px solid #d9e2d6;")+"object-fit:contain;background:#eef6ea;max-width:100%";return`<img class="${c}" style="${st}" alt="${esc(n)}" loading="lazy" src="${f?FOLDER+"/"+encodeURIComponent(f):NOPIC}" onerror="this.onerror=null;this.src=NOPIC">`};
function toast(m){const t=$("toast");t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2500)}
async function hash(p){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return btoa(unescape(encodeURIComponent(p)))}}

function setMode(r){reg=r;$("nw").hidden=!r;$("ab").textContent=r?"Create account":"Log in";$("ae").textContent="";$("tl").className="btn s"+(r?" g":"");$("tr").className="btn s"+(r?"":" g")}
if($("af")){
$("tl").onclick=()=>setMode(false);$("tr").onclick=()=>setMode(true);
$("af").onsubmit=async e=>{e.preventDefault();const em=$("em").value.trim().toLowerCase(),pw=$("pw").value,users=ls.g("ag_users",[]);
  if(pw.length<6){$("ae").textContent="Use a password with at least 6 characters.";return}
  const h=await hash(pw);
  if(reg){const nm=$("nm").value.trim();if(!nm){$("ae").textContent="Enter your full name.";return}
    if(users.some(u=>u.email===em)){$("ae").textContent="That email is already registered. Log in instead.";return}
    users.push({email:em,name:nm,h});ls.s("ag_users",users);me={email:em,name:nm}}
  else{const u=users.find(u=>u.email===em&&u.h===h);if(!u){$("ae").textContent="Wrong email or password.";return}me={email:u.email,name:u.name}}
  ls.s("ag_me",me);location.href="prices.html"};
}
if($("lo"))$("lo").onclick=()=>{me=null;ls.s("ag_me",null);location.href="index.html"};

function rPrices(){const q=$("ps").value.toLowerCase();
  $("pt").innerHTML=PRICES.filter(r=>r[0].toLowerCase().includes(q)).map(r=>`<tr><td>${pic(r[0],"th")}<b>${r[0]}</b></td><td>${r[1]}</td><td class="price">${kes(r[2])}</td><td class="${r[3]<0?"dn":"up"}">${r[3]<0?"▼":r[3]>0?"▲":"–"} ${Math.abs(r[3])}%</td></tr>`).join("")||`<tr><td colspan="4">No products match your search.</td></tr>`}
if($("ps"))$("ps").oninput=rPrices;

function lcard(l,own){return`<div class="card">${l.img?`<img class="ph" style="display:block;width:100%;height:170px;object-fit:contain;background:#eef6ea;border-radius:10px;margin-bottom:10px" alt="${esc(l.p)}" src="${l.img}">`:pic(l.p,"ph")}<span class="tag">${esc(l.loc)}</span><h3 style="margin:8px 0 2px">${esc(l.p)}</h3><div class="price">${kes(l.pr)} <span class="mu">per ${esc(l.u)}</span></div>
  <p class="mu" style="margin:6px 0">${l.q} ${esc(l.u)} available · ${esc(l.by)}</p>
  ${own?`<button class="btn d s" data-a="del" data-id="${l.id}">Remove</button>`:`<a class="btn s" style="text-decoration:none;display:inline-block" href="tel:${esc(l.ph)}">Call ${esc(l.ph)}</a>`}</div>`}
function rMarket(){if($("ml"))$("ml").innerHTML=[...listings,...SEED].map(l=>lcard(l,l.owner===me.email)).join("");
  if($("my")){const mine=listings.filter(l=>l.owner===me.email);$("my").innerHTML=mine.map(l=>lcard(l,true)).join("")||`<p class="mu">You haven’t listed anything yet.</p>`}}
const shrink=f=>new Promise(r=>{if(!f)return r("");const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,640/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);r(c.toDataURL("image/jpeg",.75))};i.onerror=()=>r("");i.src=u});
if($("sf"))$("sf").onsubmit=async e=>{e.preventDefault();const img=await shrink($("si").files[0]);listings.unshift({id:"l"+Date.now(),img,p:$("sp").value.trim(),q:+$("sq").value,u:$("su").value,pr:+$("sr").value,loc:$("sl").value.trim(),ph:$("sh").value.trim(),by:me.name,owner:me.email});
  ls.s("ag_list",listings);e.target.reset();rMarket();toast("Product listed in the marketplace")};

function rShop(){const v=$("sv").value;$("sg").innerHTML=SHOP.filter(i=>!v||i[2]===v).map(i=>`<div class="card">${pic(i[1],"ph pc")}<span class="tag">${i[2]}</span><h3 style="margin:8px 0 2px;font-size:1.05rem">${i[1]}</h3><div class="price">${kes(i[3])}</div><button class="btn s" style="margin-top:10px" data-a="add" data-id="${i[0]}">Add to cart</button></div>`).join("")}
if($("sv")){$("sv").innerHTML='<option value="">All agrovets</option>'+[...new Set(SHOP.map(i=>i[2]))].map(a=>`<option>${a}</option>`).join("");$("sv").onchange=rShop}

const total=()=>cart.reduce((s,c)=>s+c.q*SHOP.find(i=>i[0]===c.id)[3],0);
function rCart(){const n=cart.reduce((s,c)=>s+c.q,0);$("cb").hidden=!n;$("cb").textContent=n;if(!$("cl"))return;
  if(!cart.length){$("cl").innerHTML=`<p class="mu">Your cart is empty. Browse the agrovet shop to add implements.</p>`;return}
  $("cl").innerHTML=`<div class="card">${cart.map(c=>{const i=SHOP.find(x=>x[0]===c.id);return`<div class="row" style="justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bd)"><div class="row" style="flex-wrap:nowrap">${pic(i[1],"th pc")}<div><b>${i[1]}</b><div class="mu">${i[2]} · ${kes(i[3])}</div></div></div>
    <div class="row"><button class="btn g s" data-a="dec" data-id="${c.id}">−</button><b>${c.q}</b><button class="btn g s" data-a="inc" data-id="${c.id}">+</button><button class="btn d s" data-a="rm" data-id="${c.id}">Remove</button></div></div>`}).join("")}
    <p style="text-align:right;font-size:1.2rem;margin:12px 0">Total: <span class="price">${kes(total())}</span></p>
    <label for="mp">M-Pesa phone number</label><input id="mp" type="tel" placeholder="07XXXXXXXX" value="${esc(ls.g("ag_ph",""))}">
    <div class="err" id="pe"></div><button class="btn" style="width:100%;margin-top:8px" data-a="pay">Pay with M-Pesa</button>
    <p class="mu" style="margin-bottom:0">Demo mode: no real money is moved. A live setup needs a server calling the Safaricom Daraja STK Push API.</p></div>`}

function rOrders(){if(!$("ol"))return;const o=ls.g("ag_orders",[]).filter(x=>x.email===me.email);
  $("ol").innerHTML=o.map(x=>`<div class="card" style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><b>Receipt ${x.code}</b><span class="tag">Paid via M-Pesa</span></div>
  <p class="mu" style="margin:4px 0">${new Date(x.date).toLocaleString("en-KE")} · ${x.phone}</p><ul style="margin:6px 0;padding-left:18px">${x.items.map(i=>`<li>${i.q} × ${i.n}</li>`).join("")}</ul><b>${kes(x.total)}</b></div>`).join("")||`<p class="mu">No orders yet.</p>`}

const norm=v=>{const m=v.replace(/[\s-]/g,"").match(/^(?:\+?254|0)([71]\d{8})$/);return m?"254"+m[1]:null};
function modal(h){$("mbd").innerHTML=h;$("md").hidden=false}
function pay(){const ph=norm($("mp").value);if(!ph){$("pe").textContent="Enter a valid Safaricom number, e.g. 0712345678.";return}
  ls.s("ag_ph",$("mp").value);cancelled=false;const amt=total();
  modal(`<div class="sp"></div><p><b>Sending M-Pesa request…</b></p>`);
  setTimeout(()=>{if(cancelled)return;modal(`<div class="sp"></div><h3 style="margin:0">Check your phone</h3><p class="mu">An M-Pesa prompt for ${kes(amt)} was sent to +${ph}. Enter your PIN to pay.</p><button class="btn g s" data-a="cx">Cancel</button>`);
    setTimeout(()=>{if(cancelled)return;const code="S"+Math.random().toString(36).slice(2,11).toUpperCase();
      const o=ls.g("ag_orders",[]);o.unshift({code,date:Date.now(),phone:"+"+ph,email:me.email,total:amt,items:cart.map(c=>({n:SHOP.find(i=>i[0]===c.id)[1],q:c.q}))});
      ls.s("ag_orders",o);cart=[];ls.s("ag_cart",cart);rCart();rOrders();
      modal(`<h3 style="margin:0;color:var(--pr)">Payment received</h3><p>${kes(amt)} paid.<br>Receipt: <b>${code}</b></p><button class="btn" data-a="ok">View my orders</button>`)},4000)},1800)}

document.addEventListener("click",e=>{const t=e.target.closest("[data-a]");if(!t)return;const a=t.dataset.a,id=+t.dataset.id,c=cart.find(x=>x.id===id);
  if(a==="add"){c?c.q++:cart.push({id,q:1});toast("Added to cart")}
  else if(a==="inc")c.q++;else if(a==="dec"){c.q--;if(c.q<1)cart=cart.filter(x=>x!==c)}
  else if(a==="rm")cart=cart.filter(x=>x!==c);
  else if(a==="del"){listings=listings.filter(l=>l.id!==t.dataset.id);ls.s("ag_list",listings);rMarket()}
  else if(a==="pay")return pay();
  else if(a==="cx"){cancelled=true;$("md").hidden=true;toast("Payment cancelled");return}
  else if(a==="ok"){$("md").hidden=true;location.href="orders.html";return}
  ls.s("ag_cart",cart);rCart()});

function boot(){
  if(PAGE==="home"){if(me){location.href="prices.html";return}setMode(false);return}
  if(!me){location.href="index.html";return}
  $("who").textContent=me.name;
  document.querySelectorAll("#nv a").forEach(a=>a.classList.toggle("on",a.dataset.v===PAGE));
  if($("pt"))rPrices();if($("ml")||$("my"))rMarket();if($("sg"))rShop();rCart();rOrders()}
boot();