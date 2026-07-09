# Tech Electronics Store - MBA Product Management College Project

A premium, enterprise-grade, high-performance **Dynamic Electronics Retail Management Web Application** engineered to model a corporate retail operation in the Indian consumer electronics market. This system serves as a practical blueprint for high-volume consumer goods management under a capped operational budget of **₹20,00,000**, with a strategic business target of a minimum **₹1,00,000** in daily sales volumes.

This package contains the complete, ready-to-run **Python 3.13.1 + Flask + SQLite** full-stack source code, designed to be executed directly inside **Visual Studio Code**.

---

## 📂 Project Architecture & Folder Tree

```text
flask_project/
├── app.py                  # Core Flask server, routing APIs & Transaction managers
├── models.py               # SQLAlchemy models (Product, Order, Customer) for SQLite
├── requirements.txt        # Complete pip dependencies list
├── README.md               # Visual Studio Code setup & MBA study details
└── templates/
    └── index.html          # High-fidelity, animated SPA template (Bootstrap 5, CDN Tailwind)
```

---

## 🎯 Major Business & Tech Features

### 1. Unified Real-Time Stock Subtraction
* **Immediate Stock Decrements**: Whenever items are added to the cart, the remaining stock of that product decreases instantly in the storefront.
* **Intelligent Out-Of-Stock Disabling**: If a product's available stock hits zero, the card automatically shifts to a crimson red outline, disables the button, and labels the product as "Sold Out" to prevent double-buys or catalog overselling.

### 2. Tax Compliance & Auto-Tiered Bulk Discounts
* **Tiered Bulk Discounting Rules**: The system implements an auto-scaling bulk discount incentive on larger consumer orders:
  * **10+ Items**: **10%** discount on subtotal.
  * **20+ Items**: **15%** discount on subtotal.
  * **50+ Items**: **20%** discount on subtotal.
* **IGST Compliance**: Every item is subject to the standard Indian **18% GST** rate. The invoice dynamically displays subtotal exclusions, discount deductions, and explicit GST shares before presenting the final tax-compliant ledger.

### 3. Integrated Audio Synthesizer
* Uses the browser's native **Web Audio API** (without external static `.mp3` assets) to play high-fidelity sound cues for interface clicks and successful "cash-register" chime effects upon payment execution.

### 4. Interactive Live Charts
* Built-in **Plotly CDN** charts in the Director dashboard render live scatter timelines for weekly revenue monitoring and interactive category pie splits.

### 5. Multi-User State Synchronization
* When a customer executes an order:
  1. The server checks stock availability inside the SQL database.
  2. Inventory is deducted.
  3. A new tax-compliant Invoice object is generated.
  4. The client's record is checked—if the buyer is returning, their order count and cumulative spend are added together. If not, a new client registry file is created.

---

## 🛡️ Sample Login Credentials for Admin
To access the dashboard, click on **Director Panel** in the top navigation bar and enter:
* **Username:** `admin`
* **Password:** `admin123`

---

## 🚀 Steps to Run the Project in Visual Studio Code

### Prerequisite
* Ensure you have **Python 3.13.x** installed. You can verify this by running:
  ```bash
  python --version
  ```

### Step 1: Open the Project in VS Code
1. Launch **Visual Studio Code**.
2. Go to `File` > `Open Folder...` and select the `flask_project` folder.

### Step 2: Open a New Terminal
* Press ``Ctrl + ` `` (or `Terminal` > `New Terminal` in the top bar).

### Step 3: Set up a Virtual Environment (Recommended)
Create and activate an isolated Python virtual environment to keep your global dependencies clean:

* **Windows**:
  ```bash
  python -m venv venv
  venv\Scripts\activate
  ```
* **macOS / Linux**:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### Step 4: Install Dependencies
Run the command below to install all project-related libraries:
```bash
pip install -r requirements.txt
```

### Step 5: Execute the Flask Application
Run the primary script to boot the SQLite schema and start the local development server:
```bash
python app.py
```

### Step 6: Access the Application
* Open your browser of choice and navigate to:
  **`http://127.0.0.1:5000`**

On initial execution, the application automatically builds the SQLite database file (`database.db`) in your folder and seeds it with **100 realistic consumer electronics products** distributed across categories, complete with initial inventory quantities, prices in INR, reviews, ratings, and image links.

---

## 📑 MBA College Project Submission Details
* **Project Title**: Dynamic Electronics Retail Management Web Application
* **Operational Budget**: ₹20,00,000 INR
* **Expected Daily Sales Volume**: ₹1,00,000 INR
* **Technology Stack**: Python 3.13.1, Flask, SQLAlchemy, SQLite, Bootstrap 5, Plotly CDN.
