# GCO Foundation Pakistan — Next.js website

Global Connection Welfare Organization (Source of Life Friendly Home Orphanage, Gujranwala).
Static site: koi admin panel, database ya team page nahi.

## Chalane ka tareeqa
```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Content kahan se badalna hai
- `lib/site.js`      -> naam, phone, email, address, Christmas budget table, payment details (`paymentMethods`)
- `lib/projects.js`  -> Our Projects (portfolio). Naya project = ek object add karein
- Project photo      -> `public/projects/` mein daal kar `lib/projects.js` mein `image` ka path likhein
- Logo               -> `public/assets/logo.png`, `public/assets/logo.jpg`, aur `app/icon.png` (favicon)

## Forms
Contact form email app (mailto) kholta hai: globalconnectionwelfareorg@gmail.com
