"use strict";
function drawQR(el,text,n){if(!el)return;n=n||0;el.innerHTML='';if(!window.QRCode&&!window.QR_FAIL&&n<20){el.textContent='QR ban raha hai…';return setTimeout(()=>drawQR(el,text,n+1),300)}if(window.QRCode&&!window.QR_FAIL){try{new QRCode(el,{text,width:200,height:200,correctLevel:QRCode.CorrectLevel.L});return}catch(e){}}
 el.textContent='QR load nahi hua (internet check karein). Link copy karke use karein.'}
function dlQR(){const c=document.querySelector('.qrbox canvas');if(!c)return toast('QR abhi ready nahi hai');const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=S.biz.slug+'-qr.png';a.click()}
