# AutoCad ConsumeR — Complete E-Commerce Solution

> **Official WordPress & WooCommerce Engineering E-Commerce Platform**  
> **Brand Name:** AutoCad ConsumeR  
> **Currency:** Bangladeshi Taka — BDT (`৳`)  
> **Target Audience:** Architects, Structural Engineers, CAD Draftsmen, Civil Contractors, Engineering Students  

---

## 📐 Project Overview

**AutoCad ConsumeR** is a full-featured, production-ready WordPress + WooCommerce e-commerce application designed specifically for selling digital AutoCAD drawing files, dynamic block libraries, DWG/DXF sheet templates, quantity estimation tools, and turnkey 2D drafting services.

Unlike static HTML mockups or superficial demo scripts, this solution handles real backend database persistence, variable product variations, digital download access control, Bangladeshi mobile payment verification (bKash, Nagad, Rocket, COD), anti-fake-order safeguards, and quotation intake workflows.

---

## 📦 Deliverables & File Structure

This distribution archive contains:

```
autocad-consumer-ecommerce/
├── autocad-consumer-theme/        # Custom WordPress Theme
│   ├── assets/
│   │   ├── css/                    # Modular CAD & Blueprint stylesheets
│   │   │   ├── main.css            # CAD typography, grid, buttons, sections
│   │   │   ├── header-cart-drawer.css # Exact desktop & mobile header, slide-in drawer
│   │   │   ├── carousel.css        # Section B Featured Product Carousel
│   │   │   └── woocommerce-custom.css # Product cards, single product, notices
│   │   ├── js/
│   │   │   ├── main.js             # Mobile drawer, quote modal, category filters
│   │   │   ├── cart-drawer.js      # AJAX slide-in cart, qty +/- controls, remove
│   │   │   ├── carousel.js         # Touch/drag, arrows, dots, hover pause, reduced-motion
│   │   │   └── variations-enhancer.js # Real-time image, price & stock variation switcher
│   │   └── images/
│   │       ├── logo.png            # Official Brand Logo (Supplied by Client)
│   │       ├── cad-hero-mockup.svg # CAD drafting workspace hero illustration
│   │       ├── cad-blueprint-bg.svg# Precision technical drafting grid background
│   │       └── placeholders/       # High-res SVG previews for blocks, templates, BOQ
│   ├── inc/
│   │   ├── customizer.php          # Admin branding, contact, social, & hero controls
│   │   ├── template-tags.php       # Logo, social link renderers, badges
│   │   └── woocommerce-setup.php   # BDT currency (৳), AJAX cart fragments, digital bypass
│   ├── front-page.php              # Complete Homepage (Sections A to G)
│   ├── header.php                  # Exact header layout (Logo, Search, Account, Social, Cart)
│   ├── footer.php                  # Technical CAD footer, policies & Quote Request Modal
│   ├── woocommerce.php             # WooCommerce container wrapper
│   ├── style.css                   # WordPress theme header & base variables
│   └── screenshot.png              # Theme dashboard preview
│
├── autocad-consumer-core/         # Companion Feature Plugin
│   ├── autocad-consumer-core.php   # Main plugin bootstrap
│   ├── includes/
│   │   ├── class-settings.php      # Admin Menu, Dashboard Overview Pulse Widget
│   │   ├── class-payment-bkash.php # Manual bKash Send Money Gateway (Admin editable number)
│   │   ├── class-payment-nagad.php # Manual Nagad Send Money Gateway
│   │   ├── class-payment-rocket.php# Manual Rocket (DBBL) Send Money Gateway
│   │   ├── class-payment-cod.php   # Smart COD (Physical orders only; disables for digital)
│   │   ├── class-fake-order-protection.php # BD Phone validation (01...), rate limiting, duplicates
│   │   ├── class-order-management.php # TrxID verification metabox, approve/reject, audit log
│   │   ├── class-service-quote.php # Quote request handler with file uploads (.dwg, .pdf, .zip)
│   │   └── class-demo-importer.php # 1-Click CAD Catalog & Attribute Seeder
│   └── assets/                     # Admin CSS/JS and checkout payment badges
│
├── sample-data/
│   └── sample-products.json        # Structured sample CAD products, variations & categories
│
├── zips/
│   ├── autocad-consumer-theme.zip  # Ready-to-upload Theme ZIP
│   └── autocad-consumer-core.zip   # Ready-to-upload Plugin ZIP
│
├── autocad-consumer-ecommerce.zip  # Master distribution archive
└── README.md                       # Comprehensive deployment manual
```

---

## 🚀 Low-Cost Installation Guide

You can run this store on low-cost shared hosting (such as Namecheap, Hostinger, SiteGround, or any local cPanel host in Bangladesh) starting at roughly $2.50 to $4.00 per month.

### 1. Requirements
* **PHP:** Version 7.4, 8.0, 8.1, or 8.2
* **Database:** MySQL 5.7+ or MariaDB 10.3+
* **WordPress:** Version 6.0 or newer
* **WooCommerce:** Free open-source plugin from WordPress.org

### 2. Step-by-Step Installation

#### Step 1: Install WordPress
1. Log in to your hosting cPanel or dashboard.
2. Run the **1-Click WordPress Installer** (Softaculous).
3. Set your site URL, database credentials, admin username, and secure password.

#### Step 2: Install WooCommerce
1. In your WordPress Admin, go to **Plugins → Add New**.
2. Search for `WooCommerce` and click **Install Now**, then **Activate**.
3. In the setup wizard:
   - Set Store Location to **Bangladesh**.
   - Set Currency to **Bangladeshi Taka (৳ / BDT)**.

#### Step 3: Install the Custom Theme
1. In WP Admin, navigate to **Appearance → Themes → Add New → Upload Theme**.
2. Choose `autocad-consumer-theme.zip` (located inside the `zips/` folder).
3. Click **Install Now** and then **Activate**.

#### Step 4: Install the Companion Plugin
1. In WP Admin, navigate to **Plugins → Add New → Upload Plugin**.
2. Choose `autocad-consumer-core.zip` (located inside the `zips/` folder).
3. Click **Install Now** and then **Activate**.

#### Step 5: Seed Sample CAD Products (1-Click)
1. In WP Admin, open the left sidebar menu: **AutoCad ConsumeR → Sample CAD Data**.
2. Click **⚡ Populate Sample CAD Products & Categories**.
3. The system will automatically build:
   - CAD Blocks, DWG Templates, Architectural Plans, Structural Detailing, BOQ Estimators.
   - Variable packages (Basic, Professional, Enterprise) with per-variation pricing.
   - Global attributes (`pa_format`, `pa_licence`).

---

## 💳 Payment Gateway Configuration

The store features 4 checkout payment methods:

### 1. bKash Send Money (Manual)
1. Go to **WooCommerce → Settings → Payments**.
2. Click **Manage** beside **bKash Send Money**.
3. Fields you can configure:
   - **Enable/Disable:** Toggle on or off.
   - **Method Title:** e.g., `bKash Send Money`.
   - **Recipient Number:** Your official bKash mobile number (e.g. `01712345678`).
   - **Account Type:** Select `Personal`, `Merchant`, or `Agent`.
   - **Instructions:** Customer checkout guidance.
   - **QR Code Image URL:** Optional URL to your bKash QR code graphic.
4. Click **Save Changes**.

### 2. Nagad Send Money (Manual)
1. Click **Manage** beside **Nagad Send Money**.
2. Enter your Nagad recipient number and select account type (`Personal` or `Merchant`).
3. Click **Save Changes**.

### 3. Rocket (DBBL) Send Money (Manual)
1. Click **Manage** beside **Rocket (DBBL)**.
2. Enter your 12-digit Dutch-Bangla Rocket account number.
3. Click **Save Changes**.

### 4. Cash on Delivery (COD)
- Automatically works for physical parcels (e.g. plotted drawing rolls, printed portfolios).
- **Intelligent Protection:** If a customer's cart contains *only* digital CAD downloads or virtual services, COD is automatically hidden at checkout so customers cannot bypass payment.

---

## 🛡️ Order Verification & Fraud Protection Workflow

### Important Verification Principle
Submitting a Transaction ID (TrxID) is **never** treated as automatic payment proof. All manual payments are placed in the **Pending Payment Verification** (`wc-pending-verify`) state.

### How to Verify Orders:
1. Open **WooCommerce → Orders** (or click the alert banner in **AutoCad ConsumeR Dashboard**).
2. Orders needing verification will show a yellow `Pending Payment Verification` badge and the customer's TrxID.
3. In the order details page, look at the **Payment Reference & Verification** sidebar box:
   - Provider used (bKash / Nagad / Rocket).
   - Recipient number.
   - Customer's Sender number.
   - Customer's submitted **TrxID**.
   - Customer history (total past completed orders).
4. Verify the transaction in your bKash / Nagad merchant or personal statement.
5. If valid: Click **✓ Approve Payment & Unlock Files**:
   - Status transitions to `Completed`.
   - Digital download permissions for the customer unlock automatically.
   - An audit trail entry records which admin approved it and the exact timestamp.
6. If invalid: Click **✕ Reject (Invalid Reference)** to place the order on hold and alert the customer.

### Active Anti-Fake-Order Controls
* **Phone Number Regex Check:** Rejects invalid numbers. Accepts only valid 11-digit Bangladeshi formats starting with `013`, `014`, `015`, `016`, `017`, `018`, `019`.
* **Rate Limiting Shield:** Throttles bot checkout attacks by tracking IP submission frequency.
* **Duplicate Order Warning:** If the same phone number or IP submitted an order in the last 24 hours, the order is flagged with a `⚠️ Review Needed` warning badge in the orders list.
* **Honeypot Trap:** Rejects automated bot spam on the Quote Request form.

---

## 🎨 Branding & Customizer Options

To customize the website without touching source code:
1. Go to **Appearance → Customize**.
2. Click **AutoCad ConsumeR Branding**:
   - Change brand accent red (`#E50914`) or technical cyan (`#25C7D9`).
3. Click **Business Contact Info**:
   - Update Phone/Hotline, WhatsApp Number, Email, and Office Address.
4. Click **Social Media Links**:
   - Set URLs for Facebook, Instagram, YouTube, TikTok, WhatsApp, and LinkedIn.
   - Toggle individual icons on/off.
5. Click **Homepage Hero Banner**:
   - Adjust headline, description, and badge tag.
6. Click **Publish** to apply changes instantly.

---

## 📂 Digital Product Delivery Guide

For digital products (DWG files, DXF blocks, PDF drawings, Excel sheets):
1. In WP Admin, go to **Products → Add New**.
2. In Product Data, check both **Virtual** and **Downloadable**.
3. Under General:
   - Set **Regular Price** and optional **Sale Price** in BDT.
   - Click **Add File** and upload your protected `.dwg` or `.zip` file.
   - Set **Download Limit** (e.g., 5 downloads) and **Download Expiry** (e.g., 365 days).
4. WooCommerce stores protected files in `wp-content/uploads/woocommerce_uploads/` using `.htaccess` protection. File links are never exposed directly to the public.

---

## 🔧 Safe Backup & Maintenance

* **Backups:** Use the free UpdraftPlus plugin to back up database and files to Google Drive or Dropbox weekly.
* **Security:** Use Wordfence Security (free) for firewall and two-factor authentication for admin accounts.
* **No Recurring Theme Fees:** Built with clean native WordPress and WooCommerce APIs with zero paid plugin dependencies.

---

© 2026 **AutoCad ConsumeR**. Engineered for precision CAD commerce.
