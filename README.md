# ♛ QuickStore — Your Business Online

Static web app (HTML + CSS + JS). Node.js / server ki zaroorat nahi.

## Local test
`index.html` ko browser me kholein. Demo login: koi bhi email/mobile + 4+ character password.

## GitHub Pages par deploy
1. GitHub par naya repository banayein.
2. Saari files upload karein (`index.html`, `css/`, `js/`, `assets/`, `README.md`).
3. **Settings** kholein.
4. **Pages** kholein.
5. Branch me **main** (folder `/ (root)`) select karein.
6. **Save** dabayein.
7. Kuch der baad jo GitHub Pages URL dikhe use kholein.

## Store link
`index.html?store=royal-burger` (client-side fallback, GitHub Pages par chalta hai). Link me menu data juda hota hai, isliye dusre phone par bhi khulta hai (images ke bina). Orders sirf usi browser me save hote hain (localStorage).

## Files
- `js/app.js` — data layer (`DB`), helpers, login, router (yahan Supabase/Firebase lagayein)
- `js/admin.js` — Dashboard, Business, Products, Orders, Share, Pricing, Settings
- `js/store.js` — customer store, product detail, cart UI, WhatsApp order
- `js/cart.js` — cart math helper
- `js/qr.js` — QR generate/download (qrcodejs, cdnjs)

## Future scaling
`DB.get/DB.set` ko Supabase/Firebase calls se replace karein: auth, multiple businesses, cloud orders, payments, custom domain, subscriptions, analytics, coupons, inventory, delivery status, customer accounts.
