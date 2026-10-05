"use strict";
/* ===== Data layer: replace these 2 functions with Supabase/Firebase later ===== */
const DB={get(k,d){try{const v=localStorage.getItem('qs_'+k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){try{localStorage.setItem('qs_'+k,JSON.stringify(v))}catch(e){toast('Storage full — chhoti image use karein')}}};
const DEMO_BIZ={name:'Royal Burger',category:'Restaurant',whatsapp:'919876543210',maps:'',review:'',address:'123 Food Street, Bhopal',logo:'',slug:'royal-burger',tagline:'Fresh Burgers · Great Taste · Always'};
const ART=(()=>{const bg="<rect width='200' height='160' fill='#232838'/><ellipse cx='100' cy='140' rx='70' ry='8' fill='#0006'/>",
top="<path d='M38 72Q40 24 100 22Q160 24 162 72Z' fill='#e0922f'/><g fill='#fbe6b8'><ellipse cx='80' cy='44' rx='5' ry='2.5'/><ellipse cx='105' cy='36' rx='5' ry='2.5'/><ellipse cx='125' cy='50' rx='5' ry='2.5'/><ellipse cx='95' cy='57' rx='5' ry='2.5'/></g>",
lettuce="<path d='M34 76q10 12 22 0t22 0 22 0 22 0 22 0 18 0v8H34z' fill='#5cb85c'/><rect x='46' y='80' width='108' height='5' rx='2' fill='#e63946'/>",
pat=c=>`<rect x='38' y='85' width='124' height='20' rx='10' fill='${c}'/>`,
ch="<path d='M40 84h120l-14 17-14-9-14 15-14-15-14 9-14-9-14 15-14-15z' fill='#ffc928'/>",
bot="<path d='M38 108h124q-2 22-30 22H68q-28 0-30-22z' fill='#d98a2b'/>",
mk=b=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'>${bg}${b}</svg>`;
return{burger:mk(bot+pat('#5a3220')+lettuce+top),cheese:mk(bot+pat('#5a3220')+ch+lettuce+top),chicken:mk(bot+pat('#c98a3a')+lettuce+top),
fries:mk("<g fill='#ffd24a'><rect x='70' y='40' width='10' height='60' rx='3' transform='rotate(-12 75 70)'/><rect x='88' y='30' width='10' height='70' rx='3'/><rect x='106' y='36' width='10' height='64' rx='3' transform='rotate(8 111 70)'/><rect x='122' y='46' width='10' height='54' rx='3' transform='rotate(18 127 70)'/></g><path d='M62 92h76l-9 48H71z' fill='#d62828'/>"),
drink:mk("<rect x='108' y='10' width='6' height='38' fill='#fff' transform='rotate(12 111 30)'/><path d='M68 52h64l-8 88H76z' fill='#c1121f'/><rect x='62' y='44' width='76' height='10' rx='4' fill='#eee'/><circle cx='90' cy='90' r='5' fill='#fff4'/><circle cx='108' cy='110' r='4' fill='#fff4'/>")}})();
const artUrl=k=>ART[k]?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(ART[k]):'';
const DEMO_P=[['Classic Burger',80,'Burgers','🍔','Fresh veggies, special sauce, crispy and delicious.','burger'],['Cheese Burger',120,'Burgers','🧀','Extra cheese, more flavor.','cheese'],['Chicken Burger',150,'Burgers','🍗','Juicy chicken, special sauce.','chicken'],['French Fries',60,'Sides','🍟','Crispy & tasty.','fries'],['Cold Drink',40,'Drinks','🥤','Chilled & refreshing.','drink']].map((a,i)=>({id:'p'+i,name:a[0],price:a[1],category:a[2],emoji:a[3],desc:a[4],art:a[5],img:''}));
let S={biz:DB.get('biz',DEMO_BIZ),prods:DB.get('prods',DEMO_P),orders:DB.get('orders',[]),user:DB.get('user',null),seq:DB.get('seq',1024)};
const save=()=>{if(!S.imported){DB.set('biz',S.biz);DB.set('prods',S.prods)}DB.set('orders',S.orders);DB.set('seq',S.seq)};
/* ===== helpers ===== */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'₹'+(Number(n)||0).toLocaleString('en-IN');
const slugify=s=>String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'store';
const okUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'||x.protocol==='http:'}catch(e){return false}};
const okPhone=p=>/^\d{10,15}$/.test(String(p).replace(/\D/g,''));
const digits=p=>String(p||'').replace(/\D/g,'');
function toast(t){document.querySelectorAll('.toast').forEach(e=>e.remove());const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function pimg(p,cls){return `<div class="${cls}">${esc(p.emoji||'🛍️')}${(p.img||artUrl(p.art))?`<img src="${esc(p.img||artUrl(p.art))}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}</div>`}
function storeUrl(full){const base=location.href.split('#')[0].split('?')[0];let u=base+'?store='+encodeURIComponent(S.biz.slug);
 if(full){try{const d={b:{...S.biz,logo:''},p:S.prods.map(p=>({...p,img:''}))};u+='&d='+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(d)))))}catch(e){}}return u}
function copy(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Link copied ✓')).catch(()=>{const i=document.createElement('textarea');i.value=t;document.body.appendChild(i);i.select();try{document.execCommand('copy');toast('Link copied ✓')}catch(e){toast('Copy fail — manually copy karein')}i.remove()})}
function share(){const u=storeUrl(true);if(navigator.share)navigator.share({title:S.biz.name,url:u}).catch(()=>{});else copy(u)}
function closeM(){$('#modal').innerHTML=''}
function readImg(file,cb){if(!file)return cb('');const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,500/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.75))};im.onerror=()=>{toast('Image read nahi hui');cb('')};im.src=r.result};r.readAsDataURL(file)}
/* ===== Router ===== */
const NAV=[['dashboard','🏠','Dashboard'],['business','🏪','My Business'],['products','🛍️','Products'],['orders','📦','Orders'],['share','🔗','Share & QR'],['pricing','💎','Pricing'],['settings','⚙️','Settings']];
const q=new URLSearchParams(location.search);
const hm=()=>location.hash.match(/^#\/store\/([\w-]+)/);
const isStore=()=>!!(q.get('store')||hm());
function boot(){const slug=q.get('store')||(hm()&&hm()[1]);
 if(slug){const d=q.get('d');if(d&&slug!==S.biz.slug){try{const o=JSON.parse(decodeURIComponent(escape(atob(d))));if(o&&o.b&&Array.isArray(o.p)){S.biz=o.b;S.prods=o.p;S.orders=[];S.imported=true}}catch(e){}}
  return Store.init()}
 route()}
window.addEventListener('hashchange',()=>{if(!isStore())route()});
function route(){const h=(location.hash||'#/dashboard').slice(2)||'dashboard';if(!S.user){return loginView()}
 const pg=NAV.find(n=>n[0]===h)?h:'dashboard';
 $('#app').innerHTML=`<div class="shell"><aside class="side"><div class="logo" style="margin:6px 8px 20px"><b>♛</b> QuickStore<div class="m sm" style="font-weight:400">Your Business Online</div></div>
 ${NAV.slice(0,4).map(n=>`<a class="${pg===n[0]?'on':''}" href="#/${n[0]}">${n[1]} ${n[2]}</a>`).join('')}
 <a href="${esc(storeUrl(true))}" target="_blank" rel="noopener">🌐 View Store</a>
 ${NAV.slice(4).map(n=>`<a class="${pg===n[0]?'on':''}" href="#/${n[0]}">${n[1]} ${n[2]}</a>`).join('')}</aside>
 <div class="main"><div class="top"><div class="logo"><b>♛</b> QuickStore</div><button onclick="logout()">Logout</button></div><div id="pg"></div></div></div>
 <nav class="bn">${NAV.filter(n=>n[0]!=='pricing').map(n=>`<a class="${pg===n[0]?'on':''}" href="#/${n[0]}"><span>${n[1]}</span>${n[2].split(' ')[0]}</a>`).join('')}</nav>`;
 Admin[pg]();window.scrollTo(0,0)}
/* ===== Login ===== */
function loginView(mode){mode=mode||'login';$('#app').innerHTML=`<div class="login"><div style="font-size:48px;color:var(--g)">♛</div><div class="logo" style="font-size:32px">QuickStore</div><p class="m">Your Business Online</p>
<form class="card" onsubmit="return doAuth(event,'login')" novalidate style="margin-top:24px"><label>Email / Mobile Number</label><input id="lu" placeholder="you@example.com" autocomplete="username"><label>Password</label><input id="lp" type="password" placeholder="Enter your password" autocomplete="current-password">
<div class="err" id="le"></div><button class="pri full" type="submit">Login</button><button class="full" type="button" style="margin-top:10px" onclick="doAuth(null,'signup')">Sign Up</button>
<p class="sm" style="text-align:center;margin-top:14px"><a href="#" class="g" onclick="event.preventDefault();toast('Demo mode: koi bhi email + naya password dalkar Sign Up karein')">Forgot Password?</a></p></form>
<p class="m sm" style="margin-top:14px">Demo mode: koi bhi email/mobile + 4+ character password se Login ya Sign Up ho jayega.</p></div>`}
function doAuth(e,mode){if(e)e.preventDefault();const u=$('#lu').value.trim(),p=$('#lp').value,er=$('#le');
 if(!u){er.textContent='Email ya mobile number daalein';return false}
 if(!/^\S+@\S+\.\S+$/.test(u)&&!okPhone(u)){er.textContent='Sahi email ya mobile number daalein';return false}
 if(p.length<4){er.textContent='Password kam se kam 4 characters ka ho';return false}
 S.user={id:u};DB.set('user',S.user);location.hash='#/dashboard';route();return false}
function logout(){S.user=null;DB.set('user',null);loginView()}

