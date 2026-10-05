"use strict";
/* Cart helpers. Cart state lives in Store.cart (see store.js). */
const CartMath={line:(p,qty)=>(Number(p&&p.price)||0)*(Math.max(0,parseInt(qty,10))||0)};
