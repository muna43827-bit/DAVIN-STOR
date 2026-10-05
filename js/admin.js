"use strict";
/* ===== Admin pages ===== */
const Admin={
dashboard(){const h=new Date().getHours(),gr=h<12?'Good morning':h<17?'Good afternoon':'Good evening';
 $('#pg').innerHTML=`<h1>${gr} 👋</h1><p class="m" style="margin:4px 0 16px">Manage your business from one place.</p><a class="btn pri" href="#/business">Create / Edit Business</a>
 <div class="grid g3" style="margin:20px 0"><div class="card stat"><small>BUSINESS</small><h2>${esc(S.biz.name)}</h2><span class="m sm">Your online store</span></div>
 <div class="card stat"><small>PRODUCTS</small><h2>${S.prods.length}</h2><span class="m sm">Active products</span></div>
 <div class="card stat"><small>ORDERS</small><h2>${S.orders.length}</h2><span class="m sm">Total orders</span></div></div>
 <h3 style="margin-bottom:10px">Quick Actions</h3><div class="row"><a class="btn" href="#/products">➕ Add Product</a><a class="btn" href="${esc(storeUrl(true))}" target="_blank" rel="noopener">🌐 Open Customer Store</a><a class="btn" href="#/share">🔗 Generate Store Link</a></div>
 <h3 style="margin:22px 0 10px">Recent Orders</h3><div class="card">${S.orders.length?S.orders.slice(0,5).map(o=>`<div class="row sp" style="padding:6px 0"><span>#${o.id} · ${esc(o.name)}</span><span class="price">${money(o.total)} <span class="m sm">${o.status}</span></span></div>`).join(''):'<p class="m">Abhi koi order nahi. Store link share karein!</p>'}</div>`},
business(){const b=S.biz,C=['Restaurant','Cafe','Bakery','Salon','Barber','Boutique','Grocery','Juice Shop','Other'];
 $('#pg').innerHTML=`<h1>Create Business</h1><p class="m" style="margin:4px 0 16px">Fill in the details below to create your online store.</p><form class="card" style="max-width:560px" onsubmit="return saveBiz(event)" novalidate>
 <label>Business Name *</label><input id="bn" value="${esc(b.name)}"><div class="err" id="e_bn"></div>
 <label>Category</label><select id="bc">${C.map(c=>`<option ${c===b.category?'selected':''}>${c}</option>`).join('')}</select>
 <label>Tagline</label><input id="bt" value="${esc(b.tagline||'')}">
 <label>WhatsApp Number * (country code ke sath, e.g. 919876543210)</label><input id="bw" inputmode="numeric" value="${esc(b.whatsapp)}"><div class="err" id="e_bw"></div>
 <label>Google Maps Link</label><input id="bm" placeholder="https://maps.google.com/..." value="${esc(b.maps)}"><div class="err" id="e_bm"></div>
 <label>Direct Review Link (optional)</label><input id="br" placeholder="https://g.page/r/..." value="${esc(b.review||'')}"><div class="err" id="e_br"></div>
 <label>Address</label><input id="ba" value="${esc(b.address)}">
 <label>Logo / Banner Image</label><div class="row" style="margin-bottom:12px">${pimg({emoji:'🏪',img:b.logo},'pimg')}<input type="file" id="bl" accept="image/*" style="margin:0;flex:1"></div>
 <div class="row"><button class="pri" type="submit">Save Business</button><button type="button" onclick="saveBiz(null,true)">Preview Store</button></div></form>`},
products(){$('#pg').innerHTML=`<div class="row sp" style="margin-bottom:14px"><h1>Add Products</h1><button class="pri" onclick="prodForm()">+ Add Product</button></div>
 <div class="plist">${S.prods.length?S.prods.map(p=>`<div class="card">${pimg(p,'pimg')}<div class="info"><b>${esc(p.name)}</b> <span class="m sm">· ${esc(p.category)}</span><div class="m sm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.desc)}</div><div class="price">${money(p.price)}</div></div>
 <div style="display:flex;flex-direction:column;gap:6px"><button onclick="prodForm('${p.id}')">Edit</button><button class="dng" onclick="delProd('${p.id}')">Delete</button></div></div>`).join(''):'<div class="card m">Koi product nahi hai. "+ Add Product" dabayein.</div>'}</div>`},
orders(){$('#pg').innerHTML=`<h1 style="margin-bottom:14px">Orders</h1><div class="card tbl">${S.orders.length?`<table><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Date/time</th><th>Status</th></tr>
 ${S.orders.map((o,i)=>`<tr><td>#${o.id}</td><td>${esc(o.name)}</td><td>${esc(o.phone)}</td><td>${o.items.map(x=>esc(x.name)+' ×'+x.qty).join('<br>')}</td><td class="price">${money(o.total)}</td><td>${esc(new Date(o.at).toLocaleString('en-IN'))}</td>
 <td><select style="margin:0;min-width:120px" onchange="setStatus(${i},this.value)">${['New','Confirmed','Completed','Cancelled'].map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('')}</table>`:'<p class="m">Abhi koi order nahi aaya.</p>'}</div>`},
share(){const u=storeUrl(true);$('#pg').innerHTML=`<h1 style="margin-bottom:14px">Share & Grow</h1><div class="grid g2">
 <div class="card" style="text-align:center"><div style="font-size:44px;color:var(--g)">✓</div><h2>Business Created Successfully! ✓</h2><p class="m">Your store is ready to go live.</p>
 <input readonly id="su" value="${esc(u)}" onclick="this.select()" style="margin-top:14px"><button class="full" onclick="copy($('#su').value)">Copy Link</button>
 <div class="qrbox" id="qr1"></div><div class="row" style="justify-content:center"><button class="pri" onclick="dlQR()">Download QR</button><a class="btn" href="${esc(u)}" target="_blank" rel="noopener">View Store</a><button onclick="share()">Share</button></div>
 <p class="m sm" style="margin-top:12px">Note: Link me menu ka data shamil hai, isliye dusre phone par bhi khulega (images chhodkar).</p></div>
 <div class="poster"><div class="logo"><b>♛</b> ${esc(S.biz.name)}</div><h2 style="margin-top:14px">SCAN & ORDER</h2><div class="g" style="font-weight:700;font-size:13px">DIRECTLY ON WHATSAPP</div><div class="qrbox" id="qr2"></div>
 <div class="row" style="justify-content:center"><button onclick="scanQR()">📷 Scan QR</button><a class="btn" href="${esc(u)}" target="_blank" rel="noopener">View Menu</a><a class="btn wa" href="https://wa.me/${digits(S.biz.whatsapp)}" target="_blank" rel="noopener">Order on WhatsApp</a></div></div></div>`;
 drawQR($('#qr1'),u);drawQR($('#qr2'),u)},
pricing(){const P=[['STARTER','₹999',['Digital menu','WhatsApp ordering','QR code','Basic setup']],['PRO','₹2,999',['Complete order system','Categories + photos','Cart + WhatsApp','Google Maps','Review QR'],1],['PREMIUM','₹5,999',['Everything in Pro','Custom domain','Offers / coupons','Order dashboard','Monthly updates']]];
 $('#pg').innerHTML=`<h1 style="margin-bottom:14px">Packages & Pricing</h1><div class="grid g3">${P.map(p=>`<div class="card pc ${p[3]?'pop':''}">${p[3]?'<span class="tag">MOST POPULAR</span>':''}<div class="m" style="font-weight:700;margin-top:6px">${p[0]}</div><div class="price"><span class="pp">${p[1]}</span></div><ul>${p[2].map(f=>`<li>${f}</li>`).join('')}</ul><button class="${p[3]?'pri':''} full" onclick="toast('${p[0]} select kiya — jald contact karein')">Get Started</button></div>`).join('')}</div>
 <div class="card" style="margin-top:18px"><span class="tag">OPTIONAL</span><h2 style="margin-top:8px">Monthly Maintenance</h2><div class="price"><span class="pp">₹199 – ₹499</span> <span class="m sm">/ month</span></div><p class="m">Optional service — apni store ko hamesha online rakhein.</p><ul style="list-style:none;padding:0;margin-top:8px"><li>✓ Hosting & security</li><li>✓ Updates & support</li><li>✓ New features</li></ul></div>
 <div class="card" style="margin-top:18px"><h2>Why Choose QuickStore?</h2><ul style="list-style:none;padding:0;margin-top:10px;line-height:2"><li>✓ Low investment, high returns</li><li>✓ Perfect for restaurants, cafes, salons and shops</li><li>✓ Easy to manage</li><li>✓ Helps get more orders</li><li>✓ Build your digital brand</li><li>✓ Complete solution under one roof</li></ul></div>
 <p class="g" style="text-align:center;margin:22px 0;font-style:italic">Your Business, Our Technology ❤️</p>`},
settings(){$('#pg').innerHTML=`<h1 style="margin-bottom:14px">Settings</h1><div class="card" style="max-width:520px"><p class="m">Logged in: ${esc(S.user.id)}</p><p class="m" style="margin:8px 0 14px">Data is browser me (localStorage) save hota hai.</p>
 <div class="row"><button onclick="resetDemo()" class="dng">Reset demo data</button><button onclick="logout()">Logout</button></div></div>`}};
function saveBiz(e,preview){if(e)e.preventDefault();const g=i=>$('#'+i).value.trim();let ok=true;const E=(i,m)=>{$('#e_'+i).textContent=m||'';if(m)ok=false};
 E('bn',g('bn')?'':'Business name zaroori hai');E('bw',okPhone(g('bw'))?'':'Sahi WhatsApp number (10-15 digits) daalein');
 E('bm',!g('bm')||okUrl(g('bm'))?'':'Sahi http(s) link daalein');E('br',!g('br')||okUrl(g('br'))?'':'Sahi http(s) link daalein');
 if(!ok)return false;
 const done=logo=>{S.biz={...S.biz,name:g('bn'),category:$('#bc').value,tagline:g('bt'),whatsapp:digits(g('bw')),maps:g('bm'),review:g('br'),address:g('ba'),slug:slugify(g('bn')),logo:logo};save();toast('Business saved ✓');
  if(preview)window.open(storeUrl(true),'_blank','noopener');else location.hash='#/share'};
 const f=$('#bl').files[0];f?readImg(f,done):done(S.biz.logo||'');return false}
function prodForm(id){const p=S.prods.find(x=>x.id===id)||{name:'',price:'',category:'Burgers',desc:'',img:'',emoji:'🛍️'};
 $('#modal').innerHTML=`<div class="modal" onclick="if(event.target===this)closeM()"><form class="sheet" onsubmit="return saveProd(event,'${id||''}')" novalidate><h2 style="margin-bottom:12px">${id?'Edit':'Add'} Product</h2>
 <label>Product Name *</label><input id="pn" value="${esc(p.name)}"><div class="err" id="e_pn"></div>
 <label>Price (₹) *</label><input id="pp" type="number" min="1" step="1" inputmode="decimal" value="${esc(p.price)}"><div class="err" id="e_pp"></div>
 <label>Category</label><input id="pc" list="cats" value="${esc(p.category)}"><datalist id="cats">${[...new Set(['Burgers','Pizza','Drinks','Sides',...S.prods.map(x=>x.category)])].map(c=>`<option value="${esc(c)}">`).join('')}</datalist>
 <label>Image</label><input type="file" id="pi" accept="image/*"><label>Description</label><textarea id="pd" rows="2">${esc(p.desc)}</textarea>
 <div class="row"><button class="pri" type="submit">Save</button><button type="button" onclick="closeM()">Cancel</button></div></form></div>`}
function saveProd(e,id){e.preventDefault();const n=$('#pn').value.trim(),pr=parseFloat($('#pp').value);let ok=true;
 $('#e_pn').textContent=n?'':(ok=false,'Naam zaroori hai');$('#e_pp').textContent=pr>0&&isFinite(pr)?'':(ok=false,'Sahi price daalein (0 se zyada)');if(!ok)return false;
 const old=S.prods.find(x=>x.id===id),fin=img=>{const o={id:id||'p'+Date.now(),name:n,price:Math.round(pr*100)/100,category:$('#pc').value.trim()||'Other',desc:$('#pd').value.trim(),img:img,emoji:old?old.emoji:'🛍️',art:old?old.art:''};
  if(old)Object.assign(old,o);else S.prods.push(o);save();closeM();Admin.products();toast('Product saved ✓')};
 const f=$('#pi').files[0];f?readImg(f,i=>fin(i||(old?old.img:''))):fin(old?old.img:'');return false}
function delProd(id){if(confirm('Delete this product?')){S.prods=S.prods.filter(p=>p.id!==id);save();Admin.products();toast('Deleted')}}
function scanQR(){$('#modal').innerHTML=`<div class="modal" onclick="if(event.target===this)closeM()"><div class="sheet" style="text-align:center"><h2>Scan to open store</h2><p class="m sm">Phone camera se is QR ko scan karein</p><div class="qrbox" id="qr3"></div><br><button class="pri" onclick="closeM()">Close</button></div></div>`;drawQR($('#qr3'),storeUrl(true))}
function setStatus(i,s){S.orders[i].status=s;save();toast('Status: '+s)}
function resetDemo(){if(confirm('Sab data demo par reset ho jayega. Sure?')){['biz','prods','orders','seq'].forEach(k=>localStorage.removeItem('qs_'+k));S.biz=DEMO_BIZ;S.prods=DEMO_P;S.orders=[];S.seq=1024;route();toast('Reset done')}}

