# Tech Electronics Store - MBA Product Management College Project

Welcome to your dual-platform, corporate-grade **Dynamic Electronics Retail Management Web Application** developed for your MBA Product Management academic submission.

This workspace provides you with two production-ready solutions:
1. ⚡ **A Live Full-Stack React + Node.js/Express App**: Currently running live in your AI Studio web preview pane.
2. 🐍 **A Local Python 3.13.1 + Flask + SQLite App**: Completely structured inside the `/flask_project` directory, ready to download, unzip, open, and run directly in Visual Studio Code.

---

## 📂 Project Architecture

```text
/
├── server.ts                 # Real-time Express database engine & proxy endpoints (live preview)
├── package.json              # Applet configuration & dependencies (Vite, React, Express)
├── src/                      # High-performance React Frontend
│   ├── App.tsx               # Primary React state controller & views router
│   ├── types.ts              # Domain interfaces (Products, Orders, Customers)
│   ├── audio.ts              # Web Audio API Sound Synthesizer engine (no mp3 files required!)
│   └── components/
│       ├── Navbar.tsx        # Glassmorphic header with sound switches & admin login modal
│       ├── CustomerPanel.tsx # Left side browsing pane, with live searches & automatic stock counts
│       ├── LiveCartPanel.tsx # Right side real-time cart with live IGST (18%) and bulk discount rules
│       ├── ConfettiEffect.tsx# Canvas-based particle explosion for successful transactions
│       ├── InvoiceModal.tsx  # Tax-compliant printed invoice generator with custom print stylesheets
│       └── AdminPanel.tsx    # Live KPI dashboard with SVG timeline charts & product inventory CRUD
│
└── flask_project/            # Your Python project package for college submission
    ├── app.py                # Main Flask controller & RESTful database router
    ├── models.py             # SQLite SQLAlchemy schemas with seeder routines
    ├── requirements.txt      # python packages list
    ├── README.md             # In-depth setup guide for Visual Studio Code
    └── templates/
        └── index.html        # Front-end template combining Bootstrap 5, Tailwind, and Plotly
```

---

## ⚡ 1. The React & Node.js Live Preview App
Your live application is hosted securely using Node.js and served on port `3000` via our nginx container proxy.

* **Database Engine**: Handled via persistent read/writes inside `database.json` at the workspace root, preserving products, orders, and customer records.
* **To Browse the Store**: Use the left grid to filter through 100 electronics items, or search for brands (e.g. "Apple").
* **Immediate Stock Decrements**: Add an item to the cart, and watch its stock level instantly drop. If stock becomes zero, the product card shifts to Red, disables, and shows "Sold Out" dynamically.
* **Bulk Discount Tiers**:
  * **10+ Items**: **10%** discount on checkout subtotal.
  * **20+ Items**: **15%** discount.
  * **50+ Items**: **20%** discount.
* **18% IGST Tax compliant**: Pricing calculations extract the 18% GST share from the subtotal and present it in your Live Cart and printed Tax Invoice.
* **Admin Login**: Click on "Admin Login" in the header and log in with username `admin` and password `admin123`.

---

## 🐍 2. Your Python VS Code Submission Package
If you are ready to export this project to your computer and run it locally with Python 3.13.1 in VS Code:

1. Click on the **Settings menu** in the top-right corner of the AI Studio UI.
2. Select **Export to ZIP** or **Export to GitHub**.
3. Extract the downloaded archive.
4. Open your terminal in the `/flask_project` directory and execute:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
5. Open **`http://127.0.0.1:5000`** in your browser.

The Python app will build a local `database.db` SQLite schema on its first boot and automatically seed **100 products and customer registers** to match the live React database!

---

## 📊 Business Operations & Budget Modeling (₹20,00,000 Cap)
* **Budget Ceiling**: ₹20,00,000.
* **Daily Goal**: ₹1,00,000 minimum sales volume.
* **Live Calculations**: Invoices and sales aggregates are fully connected to actual SQL ledgers to track tax credits and operational quotas cleanly.
