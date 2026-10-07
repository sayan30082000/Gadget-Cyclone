# Gadget Cyclone

A gadget e-commerce store built with **React** and **Tailwind CSS**: smartwatches, earbuds, chargers, creator gear and smart-home devices, with a cart, cash-on-delivery checkout and a contact form.

**Live site:** https://gadget-cyclone.netlify.app

## Features

- **Home page** with the "Deal of the week" (Cyclone Pulse Smartwatch, Tk 1,500 instead of Tk 3,500), shop-by-category tiles, trending products and a partnership banner
- **Shop** with category filters, search, a price cap, an in-stock toggle and sorting. Every filter lives in the URL, so filtered views can be shared
- **Product pages** with colour options, quantity, stock status, highlights, a spec table and related products
- **Cart** saved in the browser, one line per product and colour, with a free-delivery progress bar
- **Checkout** with Bangladeshi mobile-number validation, delivery-area fees (inside / outside Chattogram, free over Tk 5,000) and cash on delivery
- **Orders and contact messages** are delivered through Netlify Forms. They show up in the Netlify dashboard under *Forms*, and email notifications can be turned on there
- Responsive from phone to desktop, keyboard-accessible, with no external image dependencies (product artwork is drawn in code)

## Tech stack

| | |
|---|---|
| UI | React 19, React Router 7 |
| Styling | Tailwind CSS 4 (brand colours from the logo, defined in `src/index.css`) |
| Icons | lucide-react |
| Build | Vite |
| Hosting | Netlify, which auto-deploys on every push to `main` |

## Run it locally

```bash
git clone https://github.com/sayan30082000/Gadget-Cyclone.git
cd Gadget-Cyclone
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

In `npm run dev` the order and contact forms are not sent anywhere. They log to the browser console instead, because Netlify Forms only exists on the deployed site.

## Project structure

```text
├── index.html              page shell + hidden Netlify form definitions
├── netlify.toml            build settings and the SPA redirect
├── public/                 favicon and social-share image
└── src/
    ├── data/
    │   ├── products.js     every product and category (edit here to change the catalogue)
    │   └── site.js         phone, email, city, delivery fees, free-delivery threshold
    ├── lib/                cart state, formatting, Netlify form submit, safe localStorage
    ├── components/         header, footer, product card, product artwork, toast…
    └── pages/              Home, Shop, Product, Cart, Checkout, Order placed, About, Contact, 404
```

## Editing the store

- **Products:** add or change entries in `src/data/products.js`. Each product has a price, an optional `compareAt` (the old price), stock, highlights, specs and optional colours.
- **Contact details and delivery fees:** `src/data/site.js`.
- **Order form fields:** if you add a field to checkout, add the same `name` to the hidden `order` form in `index.html`, otherwise Netlify will drop it.
