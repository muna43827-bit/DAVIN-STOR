"use strict";
/* ===== Customer store ===== */
const Store={cart:[],tab:'All',
init(){try{this.cart=JSON.parse(sessionStorage.getItem('qs_cart_'+S.biz.slug)||'[]').filter(c=>S.prods.some(p=>p.id===c.id))}catch(e){this.cart=[]}this.draw()},
persist(){try{sessionStorage.setItem('qs_cart_'+S.biz.slug,JSON.stringify(this.cart))}catch(e){}},
cnt(){return this.cart.reduce((a,c)=>a+c.qty,0)},
tot(){return this.cart.reduce((a,c)=>{const p=S.prods.find(x=>x.id===c.id);return a+(p?(Number(p.price)||0)*c.qty:0)},0)},
draw(){const b=S.biz,cats=[...new Set(['All','Burgers','Pizza','Drinks','Sides',...S.prods.map(p=>p.category)])],list=S.prods.filter(p=>this.tab==='All'||p.category===this.tab);document.title=b.name;
 $('#app').innerHTML=`<div class="store"><div class="sh">${b.logo?`<img src="${esc(b.logo)}" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover" onerror="this.remove()">`:'<div style="font-size:36px;color:var(--g)">♛</div>'}<h1>${esc(b.name)}</h1><p class="m sm">${esc(b.tagline||'')}</p>
 <div class="row" style="justify-content:center;margin-top:12px"><a class="btn" href="${esc(okUrl(b.maps)?b.maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(b.address||b.name))}" target="_blank" rel="noopener noreferrer">📍 Maps</a>${b.review&&okUrl(b.review)?`<a class="btn" href="${esc(b.review)}" target="_blank" rel="noopener noreferrer">⭐ Review</a>`:''}<a class="btn" ${digits(b.whatsapp)?`href="https://wa.me/${digits(b.whatsapp)}" target="_blank" rel="noopener noreferrer"`:`href="#" onclick="event.preventDefault();toast('WhatsApp number set nahi hai')"`}>💬 WhatsApp</a></div></div>
 <div class="hero"><div><i>Good Food</i><i>Good Mood</i><button class="pri" onclick="document.getElementById('menu').scrollIntoView({behavior:'smooth'})">Order Now</button></div></div><div class="tabs">${cats.map(c=>`<button class="${c===this.tab?'on':''}" onclick="Store.setTab(this.dataset.t)" data-t="${esc(c)}">${esc(c)}</button>`).join('')}</div>
 <h3 id="menu" style="margin:6px 0 12px">Our Menu</h3><div class="pg">${list.length?list.map(p=>`<div class="pcard" onclick="Store.detail('${p.id}')">${pimg(p,'im')}<div class="bd"><b>${esc(p.name)}</b><p>${esc(p.desc)}</p><div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><b>${money(p.price)}</b><button class="ad" onclick="event.stopPropagation();Store.add('${p.id}',1)">Add +</button></div></div></div>`).join(''):'<p class="m">Is category me koi item nahi.</p>'}</div>
 ${this.cnt()?`<div class="bar" id="cb"><span>🛒 ${this.cnt()} item${this.cnt()>1?'s':''} · ${money(this.tot())}</span><button class="pri" style="min-height:38px" onclick="Store.viewCart()">View Cart</button></div>`:''}</div>`},
setTab(t){this.tab=t;this.draw()},
add(id,n){const c=this.cart.find(x=>x.id===id);if(c)c.qty+=n;else this.cart.push({id,qty:n});this.persist();this.draw();const e=$('#cb');if(e)e.classList.add('bump');toast('Added to cart ✓')},
detail(id){const p=S.prods.find(x=>x.id===id);if(!p)return;this.dq=1;$('#modal').innerHTML=`<div class="modal" onclick="if(event.target===this)closeM()"><div class="sheet">${pimg(p,'im')}<style>.sheet .im{height:220px;border-radius:16px;font-size:80px;margin-bottom:12px;background:#1d2230;display:grid;place-items:center;position:relative;overflow:hidden}.sheet .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}</style>
 <h2>${esc(p.name)}</h2><div class="price"><span class="pp">${money(p.price)}</span></div><p class="m" style="margin:8px 0 14px">${esc(p.desc)}</p><label>Quantity</label><div class="qty" style="margin:6px 0 16px"><button onclick="Store.dqty(-1)">−</button><b id="dq">1</b><button onclick="Store.dqty(1)">+</button></div>
 <button class="pri full" onclick="Store.add('${p.id}',Store.dq);closeM()">Add to Cart</button></div></div>`},
dqty(n){this.dq=Math.max(1,Math.min(99,this.dq+n));$('#dq').textContent=this.dq},
viewCart(){const rows=this.cart.map(c=>({c,p:S.prods.find(x=>x.id===c.id)})).filter(r=>r.p);
 $('#modal').innerHTML=`<div class="modal" onclick="if(event.target===this)closeM()"><div class="sheet"><div class="row sp"><h2>Your Cart (${this.cnt()})</h2><button class="dng" onclick="Store.clear()">Clear Cart</button></div>
 ${rows.length?rows.map(r=>`<div class="ci">${pimg(r.p,'pimg')}<div style="flex:1;min-width:0"><b>${esc(r.p.name)}</b><div class="m sm">${money(r.p.price)}</div><div class="qty"><button onclick="Store.chg('${r.p.id}',-1)">−</button><b>${r.c.qty}</b><button onclick="Store.chg('${r.p.id}',1)">+</button></div></div><div style="text-align:right"><b>${money(r.p.price*r.c.qty)}</b><br><a href="#" class="dng sm" onclick="event.preventDefault();Store.chg('${r.p.id}',-999)">Remove</a></div></div>`).join('')
 +`<div class="row sp" style="margin:14px 0"><span class="m">Subtotal</span><b>${money(this.tot())}</b></div><div class="row sp" style="margin-bottom:14px"><b>Total</b><b class="price" style="font-size:22px">${money(this.tot())}</b></div>
 <h3 style="margin-bottom:6px">Your Details</h3><label>Name *</label><input id="cn" autocomplete="name"><div class="err" id="e_cn"></div><label>Phone *</label><input id="cp" inputmode="tel" autocomplete="tel"><div class="err" id="e_cp"></div><label>Address / Special Request *</label><textarea id="ca" rows="2"></textarea><div class="err" id="e_ca"></div>
 <button class="wa full" onclick="Store.order()">Proceed to WhatsApp</button>`:'<p class="m" style="margin:20px 0">Aapka cart khaali hai.</p>'}</div></div>`},
keep(){const f={};['cn','cp','ca'].forEach(i=>{const e=$('#'+i);if(e)f[i]=e.value});return f},
chg(id,n){const f=this.keep();const c=this.cart.find(x=>x.id===id);if(!c)return;c.qty+=n;if(c.qty<=0)this.cart=this.cart.filter(x=>x.id!==id);this.persist();this.draw();this.viewCart();Object.keys(f).forEach(i=>{const e=$('#'+i);if(e)e.value=f[i]})},
clear(){this.cart=[];this.persist();this.draw();closeM()},
order(){const n=$('#cn').value.trim(),p=$('#cp').value.trim(),a=$('#ca').value.trim();let ok=true;
 $('#e_cn').textContent=n?'':(ok=false,'Naam daalein');$('#e_cp').textContent=okPhone(p)?'':(ok=false,'Sahi phone number daalein');$('#e_ca').textContent=a?'':(ok=false,'Address ya request daalein');
 if(!ok)return;if(!this.cart.length)return toast('Cart khaali hai');
 const wa=digits(S.biz.whatsapp);if(!wa)return toast('Is business ka WhatsApp number set nahi hai');
 const items=this.cart.map(c=>{const pr=S.prods.find(x=>x.id===c.id);return pr?{name:pr.name,qty:c.qty,price:pr.price}:null}).filter(Boolean),total=items.reduce((s,i)=>s+i.price*i.qty,0),id=++S.seq;
 S.orders.unshift({id,name:n,phone:p,address:a,items,total,status:'New',at:Date.now()});save();
 const msg=`New Order #${id} 🍔\n\n`+items.map(i=>`• ${i.name} × ${i.qty} — ${money(i.price*i.qty)}`).join('\n')+`\n\nTotal: ${money(total)}\n\nCustomer:\nName: ${n}\nPhone: ${p}\nAddress/Note: ${a}`;
 this.cart=[];this.persist();closeM();this.draw();
 const w=window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(msg),'_blank','noopener');if(!w)location.href='https://wa.me/'+wa+'?text='+encodeURIComponent(msg)}};

boot();
