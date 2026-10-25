/**
 * AutoCad ConsumeR — Localhost Interactive Development & Preview Server
 * Connected to persistent SQLite database (autocad_consumer.sqlite)
 * Zero external dependencies.
 * 
 * Features:
 * - Real SQL Database Layer: Products, Orders, Order Items, Settings, Quotes
 * - Built-in Web Database Manager at /database (Full phpMyAdmin alternative)
 * - Desktop & mobile header with live search & social links
 * - Featured CAD product carousel with touch/drag & interactive Details Modal
 * - Section C engineering discipline categories with high-tech CAD SVG icons
 * - Instant smooth category filtering and smooth-scrolling
 * - Slide-in cart drawer with AJAX +/- quantity, remove, and totals (zero page reload)
 * - Checkout with verified bKash, Nagad, Rocket (01878205459), and COD
 * - Admin verification dashboard & anti-fraud inspection
 * - REAL DIGITAL CAD FILE DOWNLOADS with security gating (Requires Admin Approval)
 * - Automatic live status polling on Order Confirmation page
 * - Live SQL Query Console and 1-click Database Backup Export
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BASE_DIR = __dirname;
const THEME_DIR = path.join(BASE_DIR, 'autocad-consumer-theme');
const CORE_DIR = path.join(BASE_DIR, 'autocad-consumer-core');
const DOWNLOADS_DIR = path.join(BASE_DIR, 'downloads');
const DB_FILE = path.join(BASE_DIR, 'autocad_consumer.sqlite');
const MYSQL_FILE = path.join(BASE_DIR, 'autocad_consumer_mysql.sql');
const SUPABASE_FILE = path.join(BASE_DIR, 'autocad_consumer_supabase.sql');

// Load SQL Database Layer
const db = require('./database.js');

// In-memory session cart
let sessionCart = [
  {
    id: 101,
    title: 'Master Architectural CAD Block Bundle (1,500+ Blocks)',
    variation: 'Professional Pack (750 Blocks)',
    price: 899,
    qty: 1,
    img: '/theme/assets/images/placeholders/cad-blocks.svg'
  }
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
    '.sqlite': 'application/vnd.sqlite3',
    '.sql': 'text/plain; charset=utf-8',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

function renderHeader(cartCount, cartTotal) {
  const settings = db.getSettings();
  return `
  <!-- Top Engineering Bar -->
  <div class="cad-topbar">
    <div class="cad-container">
      <div class="cad-topbar-left">
        <span class="cad-topbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>${settings.phone}</span>
        </span>
        <span class="cad-topbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>24/7 Instant Digital CAD File Downloads</span>
        </span>
      </div>
      <div class="cad-topbar-right">
        <span class="cad-badge-tag">CURRENCY: BDT (৳)</span>
        <a href="/database" style="color:var(--cad-technical-cyan); font-weight:700; text-decoration:none; margin-right:12px;">🗄️ Database Manager</a>
        <a href="/admin" style="color:var(--cad-accent-orange); font-weight:700; text-decoration:none;">⚙️ Store Admin →</a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="cad-header">
    <div class="cad-container">
      <div class="cad-header-inner">
        <!-- 1. Official Logo -->
        <a href="/" class="cad-header-logo">
          <img src="/theme/assets/images/logo.png" alt="AutoCad ConsumeR" class="cad-brand-logo-img">
        </a>

        <!-- 2. Product Search -->
        <div class="cad-header-search">
          <form class="cad-search-form" onsubmit="event.preventDefault(); searchProducts(this.q.value);">
            <select class="cad-search-cat-select" onchange="filterCategory(this.value)">
              <option value="all">All Disciplines</option>
              <option value="cad-blocks">CAD Blocks</option>
              <option value="templates">Templates</option>
              <option value="architectural">Architectural</option>
              <option value="structural">Structural</option>
              <option value="boq-tools">BOQ Tools</option>
              <option value="services">CAD Services</option>
            </select>
            <input type="search" name="q" class="cad-search-input" placeholder="Search DWG blocks, templates, architectural plans..." oninput="searchProducts(this.value)">
            <button type="submit" class="cad-search-submit" title="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>
        </div>

        <!-- 3. Account Link -->
        <div class="cad-header-account">
          <a href="/database" class="cad-account-btn" title="Open Web Database Manager">
            <svg class="cad-account-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"></path><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"></path></svg>
            <div class="cad-account-text">
              <span class="cad-account-greeting">Database GUI</span>
              <span class="cad-account-label">Live SQL Manager</span>
            </div>
          </a>
        </div>

        <!-- 4. Social Links -->
        <div class="cad-header-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="cad-social-link" title="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="cad-social-link" title="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          <a href="https://wa.me/8801878205459" target="_blank" rel="noopener noreferrer" class="cad-social-link" title="WhatsApp 01878205459"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>
        </div>

        <!-- 5. Cart Button with Live Count -->
        <div class="cad-header-cart">
          <button type="button" class="cad-cart-trigger" onclick="toggleCartDrawer(true)" title="Open Cart Drawer">
            <div class="cad-cart-icon-wrap">
              <svg class="cad-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cad-cart-badge" id="liveCartCount">${cartCount}</span>
            </div>
            <span class="cad-cart-total-text" id="liveCartTotal">৳ ${cartTotal}</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Secondary Navigation Bar -->
  <nav class="cad-navbar">
    <div class="cad-container">
      <ul class="cad-nav-menu">
        <li class="cad-nav-item"><a href="/">Home</a></li>
        <li class="cad-nav-item"><a href="#cad-featured">Featured Products</a></li>
        <li class="cad-nav-item"><a href="#cad-categories">Categories</a></li>
        <li class="cad-nav-item"><a href="#cad-latest">All CAD Products</a></li>
        <li class="cad-nav-item"><a href="#cad-services">2D Drafting Services</a></li>
        <li class="cad-nav-item"><a href="/database">🗄️ Database Manager</a></li>
      </ul>
      <a href="#cad-services" onclick="openQuoteModal();" class="cad-nav-cta">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        Request Custom Quote
      </a>
    </div>
  </nav>
  `;
}

function buildDrawerItemsHtml() {
  const items = sessionCart;
  let subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (items.length === 0) {
    return `
      <div class="cad-drawer-empty" style="text-align:center; padding:40px 20px;">
        <svg style="width:64px; height:64px; stroke:#64748B; margin-bottom:16px;" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p style="color:#94A3B8; font-size:1rem; margin-bottom:16px;">Your CAD drafting cart is currently empty.</p>
        <button class="cad-btn cad-btn-secondary" onclick="toggleCartDrawer(false)">Explore CAD Catalog</button>
      </div>
    `;
  }

  let html = '<ul class="cad-drawer-items">';
  items.forEach((item, index) => {
    html += `
      <li class="cad-drawer-item">
        <img src="${item.img}" alt="${item.title}" class="cad-drawer-item-img">
        <div class="cad-drawer-item-info">
          <span class="cad-drawer-item-title">${item.title}</span>
          <div class="cad-drawer-item-meta"><span>${item.variation}</span></div>
          <div class="cad-drawer-item-price">৳ ${item.price}</div>
          <div class="cad-drawer-qty-wrap">
            <button type="button" class="cad-qty-btn" onclick="updateQty(${index}, -1)">-</button>
            <input type="text" class="cad-qty-input" value="${item.qty}" readonly>
            <button type="button" class="cad-qty-btn" onclick="updateQty(${index}, 1)">+</button>
          </div>
          <button type="button" class="cad-drawer-remove" onclick="removeFromCart(${index})" title="Remove item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </li>
    `;
  });
  html += '</ul>';
  return html;
}

function renderDrawer() {
  const items = sessionCart;
  let subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  return `
  <div id="cadDrawerBackdrop" class="cad-drawer-backdrop" onclick="toggleCartDrawer(false)"></div>
  <aside id="cadCartDrawer" class="cad-cart-drawer">
    <div class="cad-drawer-header">
      <h3 class="cad-drawer-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        Drafting Cart (<span id="drawerCountText">${items.length}</span> items)
      </h3>
      <button type="button" class="cad-drawer-close" onclick="toggleCartDrawer(false)">✕</button>
    </div>
    <div class="cad-drawer-body" id="drawerBody">
      ${buildDrawerItemsHtml()}
    </div>
    <div class="cad-drawer-footer" id="drawerFooter" style="${items.length === 0 ? 'display:none;' : ''}">
      <div class="cad-drawer-calc-row">
        <span>Subtotal:</span>
        <span id="drawerSubtotal">৳ ${subtotal}</span>
      </div>
      <div class="cad-shipping-notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>Instant download unlocked immediately after admin payment verification.</span>
      </div>
      <div class="cad-drawer-calc-row total-row">
        <span>Grand Total:</span>
        <span class="cad-drawer-total-val" id="drawerGrandTotal">৳ ${subtotal}</span>
      </div>
      <div class="cad-drawer-actions">
        <a href="/checkout" class="cad-btn-checkout">Proceed to Checkout</a>
        <button type="button" class="cad-btn-continue" onclick="toggleCartDrawer(false)">Continue Shopping →</button>
      </div>
    </div>
  </aside>
  `;
}

function renderFooter() {
  const settings = db.getSettings();
  return `
  <footer class="cad-footer">
    <div class="cad-container">
      <div class="cad-disclaimer-box">
        <strong>TECHNICAL & REGULATORY NOTICE:</strong> CAD files, templates, and 2D drafting outputs provided by AutoCad ConsumeR are design resources and drafting aids. They must not be represented as construction-ready or structurally certified unless independent review, calculation, and official seal have been performed by a licensed professional engineer (PE) or registered architect.
      </div>
      <div class="cad-footer-grid">
        <div class="cad-footer-brand">
          <img src="/theme/assets/images/logo.png" alt="AutoCad ConsumeR" class="cad-footer-logo-img">
          <p>AutoCad ConsumeR is Bangladesh's premier digital engineering marketplace. We provide production-grade AutoCAD drawings, dynamic block suites, structural details, and professional drafting conversion services.</p>
        </div>
        <div class="cad-footer-col">
          <h4>CAD Resources</h4>
          <ul class="cad-footer-links">
            <li><a href="#cad-categories" onclick="selectCategory('cad-blocks')">CAD Blocks & Symbols</a></li>
            <li><a href="#cad-categories" onclick="selectCategory('templates')">DWG/DXF Templates</a></li>
            <li><a href="#cad-categories" onclick="selectCategory('architectural')">Architectural Drafting</a></li>
            <li><a href="#cad-categories" onclick="selectCategory('structural')">Structural Drawing Sets</a></li>
            <li><a href="#cad-categories" onclick="selectCategory('boq-tools')">BOQ & Estimation Tools</a></li>
          </ul>
        </div>
        <div class="cad-footer-col">
          <h4>Database & System</h4>
          <ul class="cad-footer-links">
            <li><a href="/database">🗄️ Web Database Manager</a></li>
            <li><a href="/admin">⚙️ Admin Verification Panel</a></li>
            <li><a href="/api/admin/download-db">💾 Download SQLite (.db)</a></li>
            <li><a href="/api/admin/download-mysql">📥 Export MySQL (.sql)</a></li>
            <li><a href="/api/admin/download-supabase">⚡ Export Supabase (.sql)</a></li>
          </ul>
        </div>
        <div class="cad-footer-col">
          <h4>Engineering Office</h4>
          <ul class="cad-contact-list">
            <li><span>📍 ${settings.address}</span></li>
            <li><span>📞 ${settings.phone}</span></li>
            <li><span>💬 WhatsApp: ${settings.whatsapp}</span></li>
            <li><span>✉️ ${settings.email}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="cad-footer-bottom">
      <div class="cad-container">
        <p>&copy; 2026 <strong>AutoCad ConsumeR</strong>. All rights reserved. Persistent SQLite Database Active.</p>
        <span>Accepted BDT Payments: bKash (${settings.bkashNo}) | Nagad (${settings.nagadNo}) | Rocket (${settings.rocketNo}) | COD</span>
      </div>
    </div>
  </footer>

  <!-- Quote Request Modal -->
  <div id="cadQuoteModal" class="cad-modal-backdrop">
    <div class="cad-modal-window">
      <div class="cad-modal-header">
        <h3>📐 Request Custom CAD Drafting Quote</h3>
        <button type="button" class="cad-modal-close" onclick="closeQuoteModal()">&times;</button>
      </div>
      <div class="cad-modal-body">
        <form onsubmit="handleQuoteSubmit(event)">
          <div class="cad-form-row">
            <div class="cad-form-group">
              <label>Your Full Name *</label>
              <input type="text" name="name" class="cad-form-control" required placeholder="Engr. / Architect Name">
            </div>
            <div class="cad-form-group">
              <label>Phone Number (01XXXXXXXXX) *</label>
              <input type="tel" name="phone" class="cad-form-control" required placeholder="018XXXXXXXX" pattern="01[3-9][0-9]{8}">
            </div>
          </div>
          <div class="cad-form-row">
            <div class="cad-form-group">
              <label>Email Address *</label>
              <input type="email" name="email" class="cad-form-control" required placeholder="name@domain.com">
            </div>
            <div class="cad-form-group">
              <label>Service Required *</label>
              <select name="service" class="cad-form-control">
                <option>2D CAD Drafting (Architectural / Structural)</option>
                <option>PDF to Layered DWG Conversion</option>
                <option>Drawing Cleanup & Sheet Setup</option>
              </select>
            </div>
          </div>
          <div class="cad-form-group">
            <label>Project Scope & Instructions *</label>
            <textarea name="scope" class="cad-form-control" rows="3" required placeholder="Describe drawing scale, number of sheets, deadline..."></textarea>
          </div>
          <div class="cad-form-group">
            <label>Attach Reference File (.dwg, .dxf, .pdf, .zip, max 25MB)</label>
            <input type="file" name="file" class="cad-form-control">
          </div>
          <div id="quoteResult" style="margin-top:10px;"></div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
            <button type="button" class="cad-btn cad-btn-dark" onclick="closeQuoteModal()">Cancel</button>
            <button type="submit" class="cad-btn cad-btn-primary">Submit Quote Request</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Interactive Product Technical Details Modal -->
  <div id="cadDetailsModal" class="cad-modal-backdrop">
    <div class="cad-modal-window" style="max-width:820px;">
      <div class="cad-modal-header">
        <h3 id="modalProdTitle">CAD Resource Technical Inspection</h3>
        <button type="button" class="cad-modal-close" onclick="closeDetailsModal()">&times;</button>
      </div>
      <div class="cad-modal-body" id="modalProdBody">
        <!-- Rendered dynamically by openDetails() -->
      </div>
    </div>
  </div>

  <!-- Floating Toast Notification -->
  <div id="cadToast" class="cad-toast">✓ Item added to drafting cart!</div>
  `;
}

function renderHomePage() {
  const products = db.getProducts();
  const settings = db.getSettings();
  const cartCount = sessionCart.reduce((a, b) => a + b.qty, 0);
  const cartTotal = sessionCart.reduce((a, b) => a + (b.price * b.qty), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoCad ConsumeR — Engineering E-Commerce & Drafting Bureau</title>
  <link rel="stylesheet" href="/theme/style.css">
  <link rel="stylesheet" href="/theme/assets/css/header-cart-drawer.css">
  <link rel="stylesheet" href="/theme/assets/css/main.css">
  <link rel="stylesheet" href="/theme/assets/css/carousel.css">
  <link rel="stylesheet" href="/theme/assets/css/woocommerce-custom.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&family=Rajdhani:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    .cad-cat-icon svg { width: 28px; height: 28px; stroke: var(--cad-technical-cyan); transition: transform 0.3s ease, stroke 0.3s ease; }
    .cad-cat-card:hover .cad-cat-icon svg { transform: scale(1.15) rotate(-4deg); stroke: var(--cad-accent-orange); }
    .cad-cat-card { cursor: pointer; position: relative; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .cad-cat-card:hover { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(0,0,0,0.45); border-color: var(--cad-technical-cyan); }
    .cad-toast { position: fixed; bottom: 28px; right: 28px; background: #10B981; color: #FFFFFF; font-weight: 700; font-size: 0.95rem; padding: 14px 24px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); display: flex; align-items: center; gap: 10px; z-index: 10000; opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; }
    .cad-toast.show { opacity: 1; transform: translateY(0); }
    .cad-spec-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.88rem; }
    .cad-spec-table tr { border-bottom: 1px solid #E2E8F0; }
    .cad-spec-table td { padding: 8px 12px; }
    .cad-spec-table td:first-child { color: #64748B; font-weight: 600; width: 38%; }
    .cad-spec-table td:last-child { color: #0B1220; font-weight: 700; font-family: monospace; }
    .cad-var-option { border: 2px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.2s, background-color 0.2s; }
    .cad-var-option:hover, .cad-var-option.selected { border-color: #1769AA; background: #EFF6FF; }
    .cad-var-radio { accent-color: #1769AA; margin-right: 10px; }
  </style>
</head>
<body>
  ${renderHeader(cartCount, cartTotal)}
  
  <main>
    <!-- SECTION A — HERO BANNER -->
    <section class="cad-hero-section">
      <div class="cad-container">
        <div class="cad-hero-grid">
          <div class="cad-hero-content">
            <div class="cad-hero-badge">
              <span class="cad-hero-badge-dot"></span>
              <span>PRECISION ENGINEERING & CAD SOLUTIONS</span>
            </div>
            <h1 class="cad-hero-headline">
              Supercharge Your Drafting Workflow with <span class="highlight-red">AutoCad</span> <span class="highlight-cyan">ConsumeR</span>
            </h1>
            <p class="cad-hero-desc">
              Premium AutoCAD templates, dynamic blocks, structural drafting libraries, and professional 2D conversion services tailored for architects, engineers, and CAD professionals.
            </p>
            <div class="cad-hero-ctas">
              <a href="#cad-latest" class="cad-btn cad-btn-primary">Shop CAD Catalog</a>
              <a href="/database" class="cad-btn cad-btn-outline" style="border-color:#38BDF8; color:#38BDF8;">🗄️ Explore Live Database</a>
            </div>
            <div class="cad-hero-stats">
              <div class="cad-stat-item"><span class="cad-stat-val">100%</span><span class="cad-stat-label">Native DWG Files</span></div>
              <div class="cad-stat-item"><span class="cad-stat-val">SQLite 3</span><span class="cad-stat-label">Persistent Real Database</span></div>
              <div class="cad-stat-item"><span class="cad-stat-val">BDT (৳)</span><span class="cad-stat-label">bKash / Nagad / Rocket: ${settings.bkashNo}</span></div>
            </div>
          </div>
          <div class="cad-hero-visual">
            <img src="/theme/assets/images/cad-hero-mockup.svg" alt="CAD Workspace" class="cad-hero-img">
            <div class="cad-hero-float-card">
              <div class="cad-float-icon">✓</div>
              <div class="cad-float-text">
                <h4>AutoCAD 2024 Verified</h4>
                <p>Standard Metric Layers & Scales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION B — FEATURED CAROUSEL -->
    <section class="cad-featured-carousel-section" id="cad-featured">
      <div class="cad-container">
        <div class="cad-section-header">
          <span class="cad-section-tag">PREMIUM RESOURCES</span>
          <h2 class="cad-section-title">Explore Our Featured CAD Products</h2>
          <p class="cad-section-subtitle">Professional digital resources and drafting solutions designed to make your workflow faster and more efficient.</p>
        </div>
        <div class="cad-carousel-container">
          <div class="cad-carousel-viewport">
            <div class="cad-carousel-track" id="carouselTrack">
              ${products.map(p => `
                <div class="cad-carousel-slide">
                  <div class="cad-carousel-thumb-wrap">
                    <img src="${p.img}" alt="${p.title}" class="cad-carousel-thumb">
                    <span class="cad-carousel-badge-sale">FEATURED</span>
                    <span class="cad-carousel-badge-stock">IN STOCK</span>
                  </div>
                  <div class="cad-carousel-details">
                    <div class="cad-carousel-rating">★ ${p.rating} <span class="cad-carousel-rating-count">(${p.reviews} verified reviews)</span></div>
                    <h3 class="cad-carousel-prod-title"><a href="javascript:void(0)" onclick="openDetails(${p.id})">${p.title}</a></h3>
                    <p class="cad-carousel-desc">${p.desc}</p>
                    <div class="cad-carousel-pricing">
                      <span class="cad-carousel-price-curr">৳ ${p.salePrice}</span>
                      <span class="cad-carousel-price-old">৳ ${p.price}</span>
                    </div>
                    <div class="cad-carousel-actions">
                      <button class="cad-carousel-btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
                      <button class="cad-carousel-btn-details" onclick="openDetails(${p.id})">Details</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="cad-carousel-controls">
            <div class="cad-carousel-dots">
              <span class="cad-carousel-dot active"></span>
              <span class="cad-carousel-dot"></span>
              <span class="cad-carousel-dot"></span>
            </div>
            <div class="cad-carousel-nav-arrows">
              <button class="cad-carousel-arrow" onclick="slideCarousel(-1)" title="Previous Slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button class="cad-carousel-arrow" onclick="slideCarousel(1)" title="Next Slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION C — CATEGORIES (HIGH-TECH CAD SVG ENGINEERING ICONS) -->
    <section class="cad-categories-section" id="cad-categories">
      <div class="cad-container">
        <div class="cad-section-header">
          <span class="cad-section-tag">STRUCTURED TAXONOMY</span>
          <h2 class="cad-section-title">Browse by CAD Engineering Disciplines</h2>
          <p class="cad-section-subtitle">Explore meticulously organized AutoCAD assets, standard templates, and specialized engineering toolkits.</p>
        </div>
        <div class="cad-categories-grid">
          <div class="cad-cat-card" onclick="selectCategory('cad-blocks')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><circle cx="12" cy="12" r="3"></circle></svg></div><span class="cad-cat-count">45+ Packs</span></div>
            <h3 class="cad-cat-title">CAD Blocks & Symbols</h3>
            <p class="cad-cat-desc">1,500+ Furniture, electrical, plumbing, sanitary, and mechanical 2D blocks.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
          <div class="cad-cat-card" onclick="selectCategory('templates')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg></div><span class="cad-cat-count">18+ Sets</span></div>
            <h3 class="cad-cat-title">DWG/DXF Templates</h3>
            <p class="cad-cat-desc">Standardized drawing sheets, title blocks (A0 to A4), and CTB plot styles.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
          <div class="cad-cat-card" onclick="selectCategory('architectural')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path></svg></div><span class="cad-cat-count">32+ Plans</span></div>
            <h3 class="cad-cat-title">Architectural Drafting</h3>
            <p class="cad-cat-desc">Full residential & commercial drawings: floor plans, elevations, sections.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
          <div class="cad-cat-card" onclick="selectCategory('structural')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16"></path><path d="M4 20h16"></path><path d="M12 4v16"></path></svg></div><span class="cad-cat-count">24+ Sets</span></div>
            <h3 class="cad-cat-title">Structural Drawing Resources</h3>
            <p class="cad-cat-desc">RC column/beam rebar details, foundation layouts, and steel connections.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
          <div class="cad-cat-card" onclick="selectCategory('boq-tools')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line></svg></div><span class="cad-cat-count">12+ Tools</span></div>
            <h3 class="cad-cat-title">BOQ & Estimation Tools</h3>
            <p class="cad-cat-desc">Dynamic Excel spreadsheets with automated rate analysis for Bangladesh.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
          <div class="cad-cat-card" onclick="selectCategory('services')">
            <div class="cad-cat-header"><div class="cad-cat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 5-3 5-3-5z"></path><path d="M12 12v10"></path></svg></div><span class="cad-cat-count">Custom</span></div>
            <h3 class="cad-cat-title">Custom CAD Design Services</h3>
            <p class="cad-cat-desc">Turnkey 2D drafting, PDF-to-CAD conversion, redline cleanups, and plotting.</p>
            <div class="cad-cat-action">Explore Files →</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION D — LATEST PRODUCTS -->
    <section class="cad-latest-section" id="cad-latest">
      <div class="cad-container">
        <div class="cad-section-header">
          <span class="cad-section-tag">CATALOG</span>
          <h2 class="cad-section-title">Latest Published AutoCAD Resources</h2>
          <p class="cad-section-subtitle">Real-time inventory connected to the AutoCad ConsumeR database.</p>
        </div>
        <div class="cad-filter-bar">
          <div class="cad-filter-tabs">
            <button class="cad-filter-tab active" data-cat="all" onclick="filterCategory('all', this)">All Resources</button>
            <button class="cad-filter-tab" data-cat="cad-blocks" onclick="filterCategory('cad-blocks', this)">Blocks & Symbols</button>
            <button class="cad-filter-tab" data-cat="templates" onclick="filterCategory('templates', this)">Templates</button>
            <button class="cad-filter-tab" data-cat="architectural" onclick="filterCategory('architectural', this)">Architectural</button>
            <button class="cad-filter-tab" data-cat="structural" onclick="filterCategory('structural', this)">Structural</button>
            <button class="cad-filter-tab" data-cat="boq-tools" onclick="filterCategory('boq-tools', this)">BOQ Tools</button>
            <button class="cad-filter-tab" data-cat="services" onclick="filterCategory('services', this)">Design Services</button>
          </div>
        </div>
        <div class="cad-products-grid" id="productGrid">
          ${products.map(p => `
            <div class="cad-prod-card" data-cat="${p.category}">
              <div class="cad-prod-thumb-wrap">
                <img src="${p.img}" alt="${p.title}" class="cad-prod-thumb">
                <span class="cad-badge-sale">SALE</span>
                <span class="cad-badge-stock">IN STOCK</span>
              </div>
              <div class="cad-prod-details">
                <span class="cad-prod-cat">${p.catName}</span>
                <h3 class="cad-prod-title">${p.title}</h3>
                <p class="cad-prod-desc">${p.desc}</p>
                <div class="cad-prod-meta">
                  <div class="cad-price-wrap">
                    <span class="cad-regular-price">৳ ${p.salePrice}</span>
                    <span class="cad-old-price">৳ ${p.price}</span>
                  </div>
                </div>
                <div class="cad-card-actions">
                  <button class="cad-btn-card-cart" onclick="addToCart(${p.id})">Add to Cart</button>
                  <button class="cad-btn-card-details" onclick="openDetails(${p.id})">Select Options</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SECTION E — WHY CHOOSE US -->
    <section class="cad-why-section" id="cad-why">
      <div class="cad-container">
        <div class="cad-section-header">
          <span class="cad-section-tag">CORE VALUES</span>
          <h2 class="cad-section-title">Why AutoCAD Professionals Choose Us</h2>
          <p class="cad-section-subtitle">Engineered specifically for architects, engineers, CAD draftsmen, and construction contractors.</p>
        </div>
        <div class="cad-why-grid">
          <div class="cad-why-card">
            <div class="cad-why-icon">📐</div>
            <h3 class="cad-why-title">100% Native CAD Quality</h3>
            <p class="cad-why-desc">Clean geometries, standardized layers, zero purge errors, and scale-accurate linework matching international standards.</p>
          </div>
          <div class="cad-why-card">
            <div class="cad-why-icon">⚡</div>
            <h3 class="cad-why-title">Instant Digital Access</h3>
            <p class="cad-why-desc">Download your digital DWG, DXF, and PDF bundles immediately upon admin order verification directly from your account.</p>
          </div>
          <div class="cad-why-card">
            <div class="cad-why-icon">💳</div>
            <h3 class="cad-why-title">Verified BDT Mobile Checkout</h3>
            <p class="cad-why-desc">Pay comfortably in BDT using bKash, Nagad, Rocket Send Money to ${settings.bkashNo}, or Cash on Delivery with transparent order tracking.</p>
          </div>
          <div class="cad-why-card">
            <div class="cad-why-icon">🏗️</div>
            <h3 class="cad-why-title">Custom Drafting Backed</h3>
            <p class="cad-why-desc">Need custom modifications? Our experienced CAD operators provide rapid turnaround 2D drafting and redline revisions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION F — DESIGN SERVICES -->
    <section class="cad-services-section" id="cad-services">
      <div class="cad-container">
        <div class="cad-section-header">
          <span class="cad-section-tag">DRAFTING BUREAU</span>
          <h2 class="cad-section-title">Professional AutoCAD Drafting Services</h2>
          <p class="cad-section-subtitle">Dedicated technical services for architectural, structural, and civil engineering drawings.</p>
        </div>
        <div class="cad-services-grid">
          <div class="cad-service-card">
            <div class="cad-service-header">
              <span class="cad-service-badge">CORE SERVICE</span>
              <span class="cad-service-price">From ৳ 1,500 / sheet</span>
            </div>
            <h3 class="cad-service-title">2D CAD Drafting</h3>
            <p class="cad-service-desc">Precision architectural floor plans, building elevations, sectional cuts, and structural layouts drawn to scale in standard layers.</p>
            <ul class="cad-service-specs">
              <li>✓ Turnaround: 24 to 48 Hours</li>
              <li>✓ Includes: 2 Iterative Revisions</li>
              <li>✓ Deliverable: .DWG + Print-ready .PDF</li>
            </ul>
            <button class="cad-btn cad-btn-secondary" onclick="openQuoteModal('2D CAD Drafting')">Request Quote</button>
          </div>

          <div class="cad-service-card">
            <div class="cad-service-header">
              <span class="cad-service-badge">CONVERSION</span>
              <span class="cad-service-price">From ৳ 800 / sheet</span>
            </div>
            <h3 class="cad-service-title">PDF-to-CAD Vectorization</h3>
            <p class="cad-service-desc">Manual re-vectorization of scanned blueprints, paper blueprints, and raster PDFs into fully editable AutoCAD vector drawings with proper scales.</p>
            <ul class="cad-service-specs">
              <li>✓ Turnaround: 12 to 24 Hours</li>
              <li>✓ 100% Dimension Precision Guaranteed</li>
              <li>✓ Organized AIA / ISO CAD Layers</li>
            </ul>
            <button class="cad-btn cad-btn-secondary" onclick="openQuoteModal('PDF to CAD Conversion')">Request Quote</button>
          </div>

          <div class="cad-service-card">
            <div class="cad-service-header">
              <span class="cad-service-badge">OPTIMIZATION</span>
              <span class="cad-service-price">From ৳ 500 / file</span>
            </div>
            <h3 class="cad-service-title">Drawing Cleanup & Sheet Setup</h3>
            <p class="cad-service-desc">Audit, purge unreferenced blocks, fix scale mismatch, set up layout viewports, and calibrate monochrome/color CTB plot styles for printing.</p>
            <ul class="cad-service-specs">
              <li>✓ Turnaround: Same Day Service</li>
              <li>✓ Reduces File Size up to 70%</li>
              <li>✓ Ready for A0 / A1 / A3 Plotting</li>
            </ul>
            <button class="cad-btn cad-btn-secondary" onclick="openQuoteModal('Drawing Cleanup & Sheet Setup')">Request Quote</button>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter()}
  ${renderDrawer()}

  <!-- Client JavaScript -->
  <script>
    const productsData = ${JSON.stringify(products)};

    function showToast(msg) {
      const toast = document.getElementById('cadToast');
      if (!toast) return;
      toast.innerText = msg || '✓ Item added to drafting cart!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function toggleCartDrawer(open) {
      document.getElementById('cadCartDrawer').classList.toggle('active', open);
      document.getElementById('cadDrawerBackdrop').classList.toggle('active', open);
    }

    function openQuoteModal(service) {
      document.getElementById('cadQuoteModal').classList.add('active');
    }

    function closeQuoteModal() {
      document.getElementById('cadQuoteModal').classList.remove('active');
    }

    function closeDetailsModal() {
      document.getElementById('cadDetailsModal').classList.remove('active');
    }

    function selectCategory(cat) {
      const target = document.getElementById('cad-latest');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      const tabBtn = document.querySelector('.cad-filter-tab[data-cat="' + cat + '"]');
      filterCategory(cat, tabBtn);
    }

    function filterCategory(cat, btn) {
      if (btn) {
        document.querySelectorAll('.cad-filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      const cards = document.querySelectorAll('.cad-prod-card');
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function searchProducts(q) {
      q = q.toLowerCase();
      const cards = document.querySelectorAll('.cad-prod-card');
      cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    }

    let carouselIndex = 0;
    function slideCarousel(direction) {
      const track = document.getElementById('carouselTrack');
      const slides = track.children;
      const total = slides.length;
      carouselIndex = Math.max(0, Math.min(carouselIndex + direction, total - 1));
      const slideWidth = slides[0].offsetWidth + 24;
      track.style.transform = 'translateX(-' + (carouselIndex * slideWidth) + 'px)';
      
      const dots = document.querySelectorAll('.cad-carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === Math.min(carouselIndex, dots.length - 1));
      });
    }

    let currentSelectedVariation = null;
    let currentSelectedPrice = 0;

    function openDetails(productId) {
      const prod = productsData.find(p => p.id === productId);
      if (!prod) return;

      document.getElementById('modalProdTitle').innerText = prod.title;
      currentSelectedVariation = prod.variations ? prod.variations[0].name : 'Standard';
      currentSelectedPrice = prod.variations ? prod.variations[0].price : prod.salePrice;

      let varHtml = '';
      if (prod.variations && prod.variations.length > 0) {
        varHtml = '<h4 style="margin:16px 0 8px; font-size:0.95rem; color:#0B1220;">Select License / Package Option:</h4>';
        prod.variations.forEach((v, i) => {
          const checked = i === 0 ? 'checked' : '';
          varHtml += \`
            <label class="cad-var-option \${i === 0 ? 'selected' : ''}" onclick="selectVariation(this, '\${v.name}', \${v.price})">
              <div style="display:flex; align-items:center;">
                <input type="radio" name="modalVar" class="cad-var-radio" \${checked}>
                <strong>\${v.name}</strong>
              </div>
              <span style="font-family:monospace; font-weight:800; color:#E50914; font-size:1.05rem;">৳ \${v.price}</span>
            </label>
          \`;
        });
      }

      const bodyHtml = \`
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
          <div>
            <div style="background:#060B14; border-radius:8px; padding:18px; text-align:center; border:1px solid #1E293B;">
              <img src="\${prod.img}" alt="\${prod.title}" style="max-height:180px; width:auto; object-fit:contain;">
            </div>
            <table class="cad-spec-table">
              <tr><td>CAD Format:</td><td>\${prod.specs ? prod.specs.format : '.DWG / .DXF'}</td></tr>
              <tr><td>Scale / Units:</td><td>\${prod.specs ? prod.specs.scale : '1:1 Metric'}</td></tr>
              <tr><td>Layer Standard:</td><td>\${prod.specs ? prod.specs.layers : 'AIA Color Standard'}</td></tr>
              <tr><td>Delivery:</td><td>\${prod.specs ? prod.specs.delivery : 'Instant Download ZIP'}</td></tr>
            </table>
          </div>
          <div>
            <p style="color:#475569; font-size:0.9rem; line-height:1.6; margin-top:0;">\${prod.desc}</p>
            \${varHtml}
            <div style="margin-top:20px; padding-top:16px; border-top:1px dashed #CBD5E1; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="font-size:0.8rem; color:#64748B; text-transform:uppercase; font-weight:700;">Payable Price</span>
                <div id="modalActivePrice" style="font-size:1.6rem; font-weight:800; color:#0B1220; font-family:monospace;">৳ \${currentSelectedPrice}</div>
              </div>
              <div style="display:flex; gap:10px;">
                <button type="button" class="cad-btn cad-btn-primary" onclick="addModalItemToCart(\${prod.id})">Add to Cart</button>
                <a href="/checkout" class="cad-btn cad-btn-secondary" onclick="addModalItemToCart(\${prod.id}, false)">Buy Now</a>
              </div>
            </div>
          </div>
        </div>
      \`;

      document.getElementById('modalProdBody').innerHTML = bodyHtml;
      document.getElementById('cadDetailsModal').classList.add('active');
    }

    function selectVariation(labelEl, name, price) {
      document.querySelectorAll('.cad-var-option').forEach(el => el.classList.remove('selected'));
      labelEl.classList.add('selected');
      const radio = labelEl.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      currentSelectedVariation = name;
      currentSelectedPrice = price;
      document.getElementById('modalActivePrice').innerText = '৳ ' + price;
    }

    function addModalItemToCart(productId, openDrawer = true) {
      const prod = productsData.find(p => p.id === productId);
      if (!prod) return;
      addToCartWithDetails(prod.id, prod.title, currentSelectedVariation, currentSelectedPrice, prod.img, openDrawer);
      closeDetailsModal();
    }

    function refreshCartUI(cart, subtotal) {
      const count = cart.reduce((a, b) => a + b.qty, 0);
      document.getElementById('liveCartCount').innerText = count;
      document.getElementById('liveCartTotal').innerText = '৳ ' + subtotal;
      document.getElementById('drawerCountText').innerText = cart.length;
      document.getElementById('drawerSubtotal').innerText = '৳ ' + subtotal;
      document.getElementById('drawerGrandTotal').innerText = '৳ ' + subtotal;

      const footer = document.getElementById('drawerFooter');
      if (footer) {
        footer.style.display = cart.length === 0 ? 'none' : 'block';
      }

      if (cart.length === 0) {
        document.getElementById('drawerBody').innerHTML = \`
          <div class="cad-drawer-empty" style="text-align:center; padding:40px 20px;">
            <svg style="width:64px; height:64px; stroke:#64748B; margin-bottom:16px;" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <p style="color:#94A3B8; font-size:1rem; margin-bottom:16px;">Your CAD drafting cart is currently empty.</p>
            <button class="cad-btn cad-btn-secondary" onclick="toggleCartDrawer(false)">Explore CAD Catalog</button>
          </div>
        \`;
      } else {
        let itemsHtml = '<ul class="cad-drawer-items">';
        cart.forEach((item, index) => {
          itemsHtml += \`
            <li class="cad-drawer-item">
              <img src="\${item.img}" alt="\${item.title}" class="cad-drawer-item-img">
              <div class="cad-drawer-item-info">
                <span class="cad-drawer-item-title">\${item.title}</span>
                <div class="cad-drawer-item-meta"><span>\${item.variation}</span></div>
                <div class="cad-drawer-item-price">৳ \${item.price}</div>
                <div class="cad-drawer-qty-wrap">
                  <button type="button" class="cad-qty-btn" onclick="updateQty(\${index}, -1)">-</button>
                  <input type="text" class="cad-qty-input" value="\${item.qty}" readonly>
                  <button type="button" class="cad-qty-btn" onclick="updateQty(\${index}, 1)">+</button>
                </div>
                <button type="button" class="cad-drawer-remove" onclick="removeFromCart(\${index})" title="Remove item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </li>
          \`;
        });
        itemsHtml += '</ul>';
        document.getElementById('drawerBody').innerHTML = itemsHtml;
      }
    }

    function addToCart(productId) {
      const prod = productsData.find(p => p.id === productId);
      if (!prod) return;
      addToCartWithDetails(prod.id, prod.title, 'Standard Package', prod.salePrice, prod.img, true);
    }

    function addToCartWithDetails(id, title, variation, price, img, openDrawer) {
      fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, variation, price, img })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshCartUI(data.cart, data.subtotal);
          showToast('✓ ' + title.substring(0, 32) + '... added!');
          if (openDrawer) {
            toggleCartDrawer(true);
          }
        }
      });
    }

    function updateQty(index, delta) {
      fetch('/api/cart/qty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, delta })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshCartUI(data.cart, data.subtotal);
        }
      });
    }

    function removeFromCart(index) {
      fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshCartUI(data.cart, data.subtotal);
        }
      });
    }

    function handleQuoteSubmit(e) {
      e.preventDefault();
      const form = e.target;
      fetch('/api/quote/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          phone: form.phone.value,
          email: form.email.value,
          service: form.service.value,
          scope: form.scope.value
        })
      })
      .then(res => res.json())
      .then(res => {
        document.getElementById('quoteResult').innerHTML = '<div style="color:#10B981; font-weight:bold; padding:10px; background:#ECFDF5; border-radius:4px;">✓ Quote request saved to database! Our engineering staff will contact you within 4 hours.</div>';
        setTimeout(() => { closeQuoteModal(); form.reset(); }, 2500);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleCartDrawer(false);
        closeDetailsModal();
        closeQuoteModal();
      }
    });
  </script>
</body>
</html>`;
}

function renderCheckoutPage() {
  const items = sessionCart;
  const subtotal = items.reduce((a, b) => a + (b.price * b.qty), 0);
  const settings = db.getSettings();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout — AutoCad ConsumeR</title>
  <link rel="stylesheet" href="/theme/style.css">
  <link rel="stylesheet" href="/theme/assets/css/header-cart-drawer.css">
  <link rel="stylesheet" href="/theme/assets/css/main.css">
  <link rel="stylesheet" href="/theme/assets/css/woocommerce-custom.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body style="background:#F3F6F9;">
  ${renderHeader(items.length, subtotal)}

  <div class="cad-container" style="padding-top:40px; padding-bottom:70px;">
    <h1 class="cad-section-title" style="margin-bottom:24px;">Secure CAD Checkout</h1>

    <form onsubmit="handlePlaceOrder(event)" style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:36px;">
      <!-- Billing Info -->
      <div style="background:#fff; padding:28px; border-radius:12px; border:1px solid #E2E8F0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="margin-top:0; border-bottom:2px solid #E2E8F0; padding-bottom:12px;">1. Client & Delivery Details</h3>
        
        <div class="cad-form-row">
          <div class="cad-form-group">
            <label>Full Name *</label>
            <input type="text" name="name" class="cad-form-control" required placeholder="Engr. Tanvir Ahmed">
          </div>
          <div class="cad-form-group">
            <label>Bangladeshi Phone (01XXXXXXXXX) *</label>
            <input type="tel" name="phone" class="cad-form-control" required placeholder="01878205459" pattern="01[3-9][0-9]{8}">
          </div>
        </div>

        <div class="cad-form-group">
          <label>Email Address * (For Instant Digital File Delivery)</label>
          <input type="email" name="email" class="cad-form-control" required placeholder="tanvir@engineers.com">
        </div>

        <div class="cad-form-group">
          <label>Project / Firm Name (Optional)</label>
          <input type="text" name="company" class="cad-form-control" placeholder="Design Studio Architects">
        </div>

        <div class="cad-form-group">
          <label>Physical Delivery Address (Only if ordering plotted sheets / USB bundles)</label>
          <textarea name="address" class="cad-form-control" rows="2" placeholder="House, Road, Area, Dhaka"></textarea>
        </div>
      </div>

      <!-- Order Summary & Payment -->
      <div style="background:#fff; padding:28px; border-radius:12px; border:1px solid #E2E8F0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="margin-top:0; border-bottom:2px solid #E2E8F0; padding-bottom:12px;">2. Order Summary</h3>

        <ul style="list-style:none; padding:0; margin:0 0 18px;">
          ${items.map(item => `
            <li style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.875rem;">
              <span><strong>${item.title}</strong><br><small style="color:#64748B;">${item.variation} x ${item.qty}</small></span>
              <span style="font-family:monospace; font-weight:bold;">৳ ${item.price * item.qty}</span>
            </li>
          `).join('')}
        </ul>

        <div style="border-top:1px dashed #CBD5E1; padding-top:12px; margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; color:#0B1220;">
            <span>Total Payable:</span>
            <span style="color:#E50914; font-family:monospace;">৳ ${subtotal}</span>
          </div>
        </div>

        <h3 style="margin-top:20px; border-bottom:2px solid #E2E8F0; padding-bottom:12px;">3. Select Payment Method</h3>

        <!-- Gateways Accordion -->
        <div style="margin-bottom:14px;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:bold; cursor:pointer;">
            <input type="radio" name="paymentMethod" value="bkash" checked onclick="switchGateway('bkash')">
            <span>bKash Send Money</span>
            <img src="/core/assets/images/bkash-logo.svg" alt="bKash" style="height:22px;">
          </label>
        </div>

        <div id="bkashBox" class="cad-gateway-box" style="display:block; margin-bottom:16px;">
          <p style="font-size:0.84rem; margin-bottom:8px;">1. Send Money to our official personal bKash number:<br>
            <strong style="font-size:1.15rem; color:#E2136E; font-family:monospace;">${settings.bkashNo}</strong>
          </p>
          <div class="cad-gateway-input-group">
            <label>Your bKash Sender Number *</label>
            <input type="text" name="bkashSender" placeholder="018XXXXXXXX" class="cad-form-control" style="background:#fff; color:#000;">
          </div>
          <div class="cad-gateway-input-group">
            <label>Transaction ID (TrxID) *</label>
            <input type="text" name="bkashTrxId" placeholder="e.g. 9J583KFA1" class="cad-form-control" style="background:#fff; color:#000; text-transform:uppercase;">
          </div>
          <div class="cad-payment-pending-alert">
            Payment remains pending until confirmed by our admin.
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:bold; cursor:pointer;">
            <input type="radio" name="paymentMethod" value="nagad" onclick="switchGateway('nagad')">
            <span>Nagad Send Money</span>
            <img src="/core/assets/images/nagad-logo.svg" alt="Nagad" style="height:22px;">
          </label>
        </div>

        <div id="nagadBox" class="cad-gateway-box" style="display:none; margin-bottom:16px;">
          <p style="font-size:0.84rem; margin-bottom:8px;">Send Money to our Nagad number:<br>
            <strong style="font-size:1.15rem; color:#F7941D; font-family:monospace;">${settings.nagadNo}</strong>
          </p>
          <div class="cad-gateway-input-group">
            <label>Your Nagad Sender Number *</label>
            <input type="text" name="nagadSender" placeholder="018XXXXXXXX" class="cad-form-control" style="background:#fff; color:#000;">
          </div>
          <div class="cad-gateway-input-group">
            <label>Nagad TrxID *</label>
            <input type="text" name="nagadTrxId" placeholder="e.g. 71A82BC3" class="cad-form-control" style="background:#fff; color:#000; text-transform:uppercase;">
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:bold; cursor:pointer;">
            <input type="radio" name="paymentMethod" value="rocket" onclick="switchGateway('rocket')">
            <span>Rocket (DBBL)</span>
            <img src="/core/assets/images/rocket-logo.svg" alt="Rocket" style="height:22px;">
          </label>
        </div>

        <div id="rocketBox" class="cad-gateway-box" style="display:none; margin-bottom:16px;">
          <p style="font-size:0.84rem; margin-bottom:8px;">Send Money to Rocket account:<br>
            <strong style="font-size:1.15rem; color:#8C3494; font-family:monospace;">${settings.rocketNo}</strong>
          </p>
          <div class="cad-gateway-input-group">
            <label>Rocket 12-digit Number *</label>
            <input type="text" name="rocketSender" placeholder="018XXXXXXXXX" class="cad-form-control" style="background:#fff; color:#000;">
          </div>
          <div class="cad-gateway-input-group">
            <label>Rocket TrxID *</label>
            <input type="text" name="rocketTrxId" placeholder="e.g. RCK1298492" class="cad-form-control" style="background:#fff; color:#000; text-transform:uppercase;">
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label style="display:flex; align-items:center; gap:8px; font-weight:bold; cursor:pointer;">
            <input type="radio" name="paymentMethod" value="cod" onclick="switchGateway('cod')">
            <span>Cash on Delivery (COD)</span>
            <img src="/core/assets/images/cod-icon.svg" alt="COD" style="height:22px;">
          </label>
        </div>

        <button type="submit" class="cad-btn-checkout" style="width:100%; border:none; cursor:pointer; font-size:1.05rem;">
          Place Order (৳ ${subtotal})
        </button>
      </div>
    </form>
  </div>

  <script>
    function switchGateway(gw) {
      document.getElementById('bkashBox').style.display = (gw === 'bkash') ? 'block' : 'none';
      document.getElementById('nagadBox').style.display = (gw === 'nagad') ? 'block' : 'none';
      document.getElementById('rocketBox').style.display = (gw === 'rocket') ? 'block' : 'none';
    }

    function handlePlaceOrder(e) {
      e.preventDefault();
      const form = e.target;
      const data = {
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        method: form.paymentMethod.value,
        senderNumber: form[form.paymentMethod.value + 'Sender'] ? form[form.paymentMethod.value + 'Sender'].value : form.phone.value,
        trxId: form[form.paymentMethod.value + 'TrxId'] ? form[form.paymentMethod.value + 'TrxId'].value : 'N/A'
      };

      fetch('/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          window.location.href = '/order-received?order=' + res.orderId;
        } else {
          alert(res.message);
        }
      });
    }
  </script>
</body>
</html>`;
}

function renderOrderReceived(orderId) {
  const order = db.getOrderById(orderId) || db.getOrders()[0];
  const items = order.itemsList && order.itemsList.length > 0 ? order.itemsList : [
    {
      id: 101,
      title: order.items || 'Master Architectural CAD Block Bundle (1,500+ Blocks)',
      variation: 'Professional Pack (750 Blocks)',
      file: 'cad-blocks-bundle.zip',
      fileSize: '3.2 MB',
      format: '.DWG / .DXF Suite'
    }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation & CAD Downloads — AutoCad ConsumeR</title>
  <link rel="stylesheet" href="/theme/style.css">
  <link rel="stylesheet" href="/theme/assets/css/header-cart-drawer.css">
  <link rel="stylesheet" href="/theme/assets/css/main.css">
  <link rel="stylesheet" href="/theme/assets/css/woocommerce-custom.css">
  <style>
    .order-status-card { border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: left; }
    .status-locked { background: #FFFBEB; border: 2px solid #FCD34D; color: #92400E; }
    .status-unlocked { background: #ECFDF5; border: 2px solid #34D399; color: #065F46; }
    .cad-download-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    .cad-file-badge { font-family: monospace; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; background: #EFF6FF; color: #1769AA; font-weight: bold; }
    .btn-download-active { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF !important; padding: 12px 22px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35); transition: all 0.2s ease; }
    .btn-download-active:hover { background: #047857; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45); }
    .btn-download-locked { background: #E2E8F0; color: #94A3B8 !important; padding: 12px 22px; border-radius: 8px; font-weight: 700; cursor: not-allowed; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #CBD5E1; }
    .pulse-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #F59E0B; animation: pulse 1.5s infinite; margin-right: 6px; }
    @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
  </style>
</head>
<body style="background:#F3F6F9;">
  ${renderHeader(0, 0)}

  <div class="cad-container" style="padding-top:40px; padding-bottom:70px; max-width:820px;">
    <div style="background:#fff; border-radius:12px; padding:36px; border:1px solid #E2E8F0; box-shadow:0 6px 20px rgba(0,0,0,0.06); text-align:center;">
      <div style="width:64px; height:64px; background:#EFF6FF; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 18px; color:#1769AA; font-size:2rem;">
        ${order.verified ? '✅' : '⏳'}
      </div>
      
      <h1 style="color:#0B1220; margin-bottom:8px;">
        ${order.verified ? 'Payment Approved! CAD Files Ready' : 'Thank You! Your CAD Order Has Been Received'}
      </h1>
      <p style="color:#64748B; font-size:1rem; margin-bottom:24px;">Order Number: <strong style="color:#E50914; font-family:monospace; font-size:1.15rem;">#${order.orderId}</strong></p>

      <div id="orderStatusBox" class="order-status-card ${order.verified ? 'status-unlocked' : 'status-locked'}">
        ${order.verified ? `
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <span style="font-size:1.3rem;">✅</span>
            <strong style="font-size:1.1rem; color:#065F46;">Status: Payment Verified & Approved (Completed)</strong>
          </div>
          <p style="margin:0; font-size:0.92rem; line-height:1.6; color:#047857;">
            আপনার পেমেন্ট সফলভাবে ভেরিফাই ও অনুমোদন করা হয়েছে! নিচে দেওয়া সবুজ বাটন থেকে আপনার প্রয়োজনীয় সব অরিজিনাল ক্যাড ফাইল (.DWG / .DXF / PDF) সরাসরি ডাউনলোড করে নিন।
          </p>
        ` : `
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <div style="display:flex; align-items:center;">
              <span class="pulse-dot"></span>
              <strong style="font-size:1.05rem; color:#92400E;">Status: Pending Payment Verification</strong>
            </div>
            <button type="button" onclick="checkStatusManually()" style="background:#fff; border:1px solid #D97706; color:#92400E; font-size:0.75rem; font-weight:bold; padding:4px 10px; border-radius:4px; cursor:pointer;">↻ Check Status</button>
          </div>
          <p style="margin:0 0 10px; font-size:0.9rem; line-height:1.5;">
            আপনার <strong>${order.method}</strong> সাবমিশন (Sender: <code>${order.senderNumber}</code>, TrxID: <code>${order.trxId}</code>) আমাদের ভেরিফিকেশন অফিসার যাচাই করছেন।
          </p>
          <div style="background:#FEF3C7; border-radius:6px; padding:10px; font-size:0.84rem; color:#78350F;">
            🔒 <strong>ফাইল ডাউনলোড লক রয়েছে:</strong> অ্যাডমিন প্যানেল থেকে <em>"Approve & Unlock"</em> বাটন প্রেস করা মাত্রই এই পেজে স্বয়ংক্রিয়ভাবে ডাউনলোড সক্রিয় হয়ে যাবে।
          </div>
        `}
      </div>

      <!-- Downloadable Items List -->
      <div style="text-align:left; margin-bottom:28px;">
        <h3 style="margin-bottom:14px; color:#0B1220; display:flex; align-items:center; gap:8px;">
          <span>📦</span> Digital CAD Product Files
        </h3>
        ${items.map(item => `
          <div class="cad-download-card">
            <div>
              <div style="font-weight:700; color:#0B1220; font-size:1rem; margin-bottom:4px;">${item.title}</div>
              <div style="display:flex; gap:8px; align-items:center; margin-bottom:6px;">
                <span class="cad-file-badge">${item.format || '.DWG / .DXF'}</span>
                <span style="font-size:0.8rem; color:#64748B;">Size: ${item.fileSize || '3.2 MB'}</span>
                <span style="font-size:0.8rem; color:#10B981; font-weight:600;">✓ Commercial License</span>
              </div>
              <div style="font-size:0.8rem; color:#94A3B8;">AutoCAD 2007–2025 Native Linework • Calibrated 1:1 Scale</div>
            </div>
            <div>
              ${order.verified ? `
                <a href="/api/download?order=${order.orderId}&id=${item.id}" class="btn-download-active" title="Download ZIP Archive">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download (.ZIP)</span>
                </a>
              ` : `
                <button type="button" class="btn-download-locked" title="Download will unlock upon admin payment verification">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span>Locked (Pending)</span>
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Order Details Summary Table -->
      <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem; margin-bottom:28px;">
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Client Name:</td><td style="padding:10px 0; font-weight:bold;">${order.customerName}</td></tr>
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Phone:</td><td style="padding:10px 0; font-family:monospace;">${order.phone}</td></tr>
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Total Amount:</td><td style="padding:10px 0; font-weight:bold; color:#E50914; font-family:monospace;">৳ ${order.total}</td></tr>
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Payment Gateway:</td><td style="padding:10px 0;">${order.method}</td></tr>
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Transaction ID:</td><td style="padding:10px 0; font-family:monospace; font-weight:bold;">${order.trxId}</td></tr>
        <tr style="border-bottom:1px solid #E2E8F0;"><td style="padding:10px 0; color:#64748B;">Database:</td><td style="padding:10px 0; color:#10B981; font-weight:bold;">Persistent SQLite (autocad_consumer.sqlite)</td></tr>
      </table>

      <div style="display:flex; justify-content:center; gap:14px;">
        <a href="/" class="cad-btn cad-btn-secondary">Return to Catalog</a>
        <a href="/database" class="cad-btn cad-btn-secondary" style="border-color:#38BDF8; color:#0284C7;">🗄️ View in Database Manager</a>
        <a href="/admin" class="cad-btn cad-btn-primary">Open Admin Console to Approve</a>
      </div>
    </div>
  </div>

  <script>
    const orderId = '${order.orderId}';
    let isCurrentlyVerified = ${order.verified ? 'true' : 'false'};

    if (!isCurrentlyVerified) {
      const pollInterval = setInterval(() => {
        fetch('/api/order/status?order=' + orderId)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.verified) {
              clearInterval(pollInterval);
              window.location.reload();
            }
          })
          .catch(() => {});
      }, 3000);
    }

    function checkStatusManually() {
      fetch('/api/order/status?order=' + orderId)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.verified) {
            window.location.reload();
          } else {
            alert('Verification still in progress for #' + orderId + '. If you approved in /admin, please wait 2 seconds.');
          }
        });
    }
  </script>
</body>
</html>`;
}

function renderAdminPage() {
  const orders = db.getOrders();
  const pendingOrders = orders.filter(o => !o.verified);
  const settings = db.getSettings();
  const stats = db.getStats();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AutoCad ConsumeR — Admin & Database Management Console</title>
  <link rel="stylesheet" href="/theme/style.css">
  <link rel="stylesheet" href="/theme/assets/css/main.css">
  <style>
    body { background:#F1F5F9; font-family:'Segoe UI', sans-serif; margin:0; padding:24px; color:#1E293B; }
    .admin-card { background:#fff; border-radius:8px; border:1px solid #E2E8F0; padding:24px; box-shadow:0 2px 6px rgba(0,0,0,0.05); margin-bottom:24px; }
    table { width:100%; border-collapse:collapse; font-size:0.875rem; }
    th { background:#0B1220; color:#fff; padding:12px; text-align:left; font-size:0.8rem; text-transform:uppercase; }
    td { padding:14px 12px; border-bottom:1px solid #E2E8F0; vertical-align:middle; }
    .btn-verify { background:#10B981; color:#fff; border:none; padding:7px 14px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.82rem; }
    .btn-verify:hover { background:#059669; }
    .btn-reject { background:#EF4444; color:#fff; border:none; padding:7px 14px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.82rem; }
    .btn-reject:hover { background:#DC2626; }
    .sql-code-box { background:#0B1220; color:#38BDF8; font-family:monospace; padding:14px; border-radius:6px; font-size:0.85rem; overflow-x:auto; margin-top:10px; }
  </style>
</head>
<body>
  <div style="max-width:1240px; margin:0 auto;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div style="display:flex; align-items:center; gap:16px;">
        <img src="/theme/assets/images/logo.png" alt="AutoCad ConsumeR" style="max-height:48px;">
        <div>
          <h1 style="margin:0; font-size:1.6rem; color:#0B1220;">Administration & Database Console</h1>
          <span style="font-size:0.85rem; color:#059669; font-weight:bold;">● Active Persistent SQLite Database: autocad_consumer.sqlite</span>
        </div>
      </div>
      <div style="display:flex; gap:10px;">
        <a href="/database" class="cad-btn cad-btn-secondary" style="font-size:0.85rem; background:#38BDF8; color:#0B1220; font-weight:bold;">🗄️ Open Database GUI (phpMyAdmin alternative)</a>
        <a href="/api/admin/download-db" class="cad-btn cad-btn-secondary" style="font-size:0.85rem; background:#EFF6FF; color:#1769AA;">💾 Backup SQLite (.db)</a>
        <a href="/api/admin/download-mysql" class="cad-btn cad-btn-secondary" style="font-size:0.85rem; background:#FEF3C7; color:#92400E;">📥 Export MySQL (.sql)</a>
        <a href="/api/admin/download-supabase" class="cad-btn cad-btn-secondary" style="font-size:0.85rem; background:#D1FAE5; color:#065F46; font-weight:bold;">⚡ Supabase (.sql)</a>
        <a href="/" class="cad-btn cad-btn-primary" style="font-size:0.85rem;">View Store →</a>
      </div>
    </div>

    <!-- Summary Widgets -->
    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:16px; margin-bottom:24px;">
      <div class="admin-card" style="margin:0; text-align:center;">
        <div style="font-size:1.8rem; font-weight:800; color:#1769AA;">${stats.totalOrders}</div>
        <div style="font-size:0.75rem; color:#64748B; font-weight:bold; text-transform:uppercase;">Total Orders</div>
      </div>
      <div class="admin-card" style="margin:0; text-align:center;">
        <div style="font-size:1.8rem; font-weight:800; color:#D97706;">${stats.pendingOrders}</div>
        <div style="font-size:0.75rem; color:#92400E; font-weight:bold; text-transform:uppercase;">Pending Verification</div>
      </div>
      <div class="admin-card" style="margin:0; text-align:center;">
        <div style="font-size:1.8rem; font-weight:800; color:#10B981;">৳ ${stats.verifiedRevenue}</div>
        <div style="font-size:0.75rem; color:#065F46; font-weight:bold; text-transform:uppercase;">Verified Revenue</div>
      </div>
      <div class="admin-card" style="margin:0; text-align:center;">
        <div style="font-size:1.8rem; font-weight:800; color:#6366F1;">${stats.totalProducts}</div>
        <div style="font-size:0.75rem; color:#4338CA; font-weight:bold; text-transform:uppercase;">Products in DB</div>
      </div>
      <div class="admin-card" style="margin:0; text-align:center;">
        <div style="font-size:1.8rem; font-weight:800; color:#059669;">${stats.dbSize}</div>
        <div style="font-size:0.75rem; color:#065F46; font-weight:bold; text-transform:uppercase;">Database File Size</div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="admin-card">
      <h3 style="margin-top:0; margin-bottom:16px;">Customer Mobile Payment Queue (bKash / Nagad / Rocket to ${settings.bkashNo})</h3>
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Method</th>
            <th>Sender Mobile</th>
            <th>Submitted TrxID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Admin Action / Download Link</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td><strong style="font-family:monospace; color:#1769AA;">#${order.orderId}</strong></td>
              <td><strong>${order.customerName}</strong></td>
              <td style="font-family:monospace;">${order.phone}</td>
              <td><span style="font-weight:600;">${order.method}</span></td>
              <td style="font-family:monospace; font-weight:bold;">${order.senderNumber}</td>
              <td><code style="background:#FEF2F2; color:#E50914; font-weight:bold; padding:4px 8px; border-radius:4px; font-size:0.95rem;">${order.trxId}</code></td>
              <td style="font-weight:bold; font-family:monospace;">৳ ${order.total}</td>
              <td>
                <span style="padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.75rem; ${order.verified ? 'background:#D1FAE5; color:#065F46;' : 'background:#FEF3C7; color:#92400E;'}">
                  ${order.status}
                </span>
              </td>
              <td>
                ${!order.verified ? `
                  <div style="display:flex; gap:6px;">
                    <button class="btn-verify" onclick="verifyOrder('${order.orderId}')">✓ Approve & Unlock</button>
                    <button class="btn-reject" onclick="rejectOrder('${order.orderId}')">✕ Reject</button>
                  </div>
                ` : `
                  <div>
                    <span style="color:#059669; font-weight:bold; font-size:0.85rem; display:block; margin-bottom:4px;">✓ Approved & Unlocked</span>
                    <div style="display:flex; gap:6px;">
                      <a href="/order-received?order=${order.orderId}" target="_blank" style="display:inline-block; background:#EFF6FF; color:#1769AA; font-size:0.75rem; font-weight:bold; padding:4px 8px; border-radius:4px; text-decoration:none;">🔗 Client View</a>
                      <a href="/api/download?order=${order.orderId}&id=${order.itemsList && order.itemsList[0] ? order.itemsList[0].id : 101}" target="_blank" style="display:inline-block; background:#D1FAE5; color:#065F46; font-size:0.75rem; font-weight:bold; padding:4px 8px; border-radius:4px; text-decoration:none;">⬇️ Test Download</a>
                    </div>
                  </div>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Database Schema & Live SQL Console -->
    <div class="admin-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h3 style="margin:0;">Interactive SQL Database Console</h3>
        <span style="font-size:0.8rem; color:#64748B;">Tables: <code>products</code>, <code>orders</code>, <code>order_items</code>, <code>settings</code>, <code>quotes</code></span>
      </div>
      <p style="font-size:0.85rem; color:#64748B; margin-top:0;">
        Execute real-time SQL queries directly on <strong>autocad_consumer.sqlite</strong>. Try: <code>SELECT * FROM orders</code> or <code>SELECT * FROM products</code>
      </p>
      <div style="display:flex; gap:10px;">
        <input type="text" id="sqlInput" class="cad-form-control" style="font-family:monospace; font-size:0.9rem;" value="SELECT order_id, customer_name, total, method, status FROM orders LIMIT 5">
        <button type="button" class="cad-btn cad-btn-primary" onclick="runSqlQuery()" style="font-size:0.85rem; white-space:nowrap;">▶ Execute SQL</button>
      </div>
      <div id="sqlOutput" class="sql-code-box" style="display:none; max-height:220px; overflow-y:auto;"></div>
    </div>

    <!-- Store & Gateway Settings Form -->
    <div class="admin-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="margin:0;">⚙️ Store & Payment Gateway Settings (Persistent SQLite Database)</h3>
        <a href="/database" class="db-tab-btn" style="text-decoration:none; background:#38BDF8; color:#0F172A; font-weight:700; border:none; padding:7px 14px; border-radius:4px; font-size:0.85rem;">Open in Database Manager →</a>
      </div>
      <p style="font-size:0.85rem; color:#64748B; margin-top:0;">Changes saved here are permanently written to the <code>settings</code> table in <code>autocad_consumer.sqlite</code> and instantly update the entire storefront.</p>
      <form onsubmit="saveSettings(event)" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:18px;">
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#38BDF8;">Store Brand Name</label>
          <input type="text" name="brandName" value="${settings.brandName || 'AutoCad ConsumeR'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#38BDF8;">Customer Helpline Phone</label>
          <input type="text" name="phone" value="${settings.phone || '+880 1878-205459'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#25D366;">Official WhatsApp</label>
          <input type="text" name="whatsapp" value="${settings.whatsapp || '01878205459'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#E2136E;">bKash Recipient Number</label>
          <input type="text" name="bkashNo" value="${settings.bkashNo || '01878205459'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#F7941D;">Nagad Recipient Number</label>
          <input type="text" name="nagadNo" value="${settings.nagadNo || '01878205459'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#8C3494;">Rocket 12-digit Number</label>
          <input type="text" name="rocketNo" value="${settings.rocketNo || '01878205459'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div style="grid-column:1 / -1;">
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#94A3B8;">Official Support Email</label>
          <input type="text" name="email" value="${settings.email || 'support@autocadconsumer.com'}" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div style="grid-column:1 / -1; display:flex; justify-content:flex-end;">
          <button type="submit" class="cad-btn cad-btn-primary" style="font-size:0.9rem; padding:10px 24px;">💾 Save All Settings to Database</button>
        </div>
      </form>
    </div>

    <!-- Supabase Cloud Connection Card -->
    <div class="admin-card" style="border: 2px solid ${settings.supabaseActive === '1' && settings.supabaseUrl ? '#10B981' : '#334155'};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <h3 style="margin:0;">⚡ Supabase Cloud Database Connection</h3>
          ${settings.supabaseActive === '1' && settings.supabaseUrl 
            ? '<span style="background:#10B981; color:#fff; padding:4px 10px; border-radius:4px; font-size:0.75rem; font-weight:bold;">🟢 CONNECTED TO SUPABASE CLOUD</span>' 
            : '<span style="background:#F59E0B; color:#000; padding:4px 10px; border-radius:4px; font-size:0.75rem; font-weight:bold;">🟡 NOT CONNECTED (RUNNING ON LOCAL SQLITE)</span>'}
        </div>
        <a href="/api/admin/download-supabase" class="cad-btn cad-btn-secondary" style="font-size:0.8rem; background:#D1FAE5; color:#065F46; font-weight:bold;">Download autocad_consumer_supabase.sql</a>
      </div>
      <p style="font-size:0.85rem; color:#64748B; margin-top:0;">
        বর্তমানে আপনার অ্যাপ্লিকেশনটি লোকাল <code>autocad_consumer.sqlite</code> ডেটাবেজে রান করছে। আপনি যদি Supabase-এ আপনার ডেটাবেজ যুক্ত করতে চান, আপনার Supabase প্রজেক্টের <strong>Project URL</strong> এবং <strong>API Key</strong> নিচে দিয়ে <strong>"Test & Connect"</strong> করুন।
      </p>
      <form onsubmit="saveSupabaseConfig(event)" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#3ECF8E;">Supabase Project URL</label>
          <input type="text" id="supabaseUrlInput" name="supabaseUrl" value="${settings.supabaseUrl || ''}" placeholder="https://your-project-ref.supabase.co" class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div>
          <label style="display:block; font-weight:bold; margin-bottom:6px; color:#3ECF8E;">Supabase anon / service_role API Key</label>
          <input type="password" id="supabaseKeyInput" name="supabaseKey" value="${settings.supabaseKey || ''}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="cad-form-control" style="background:#fff; color:#000;">
        </div>
        <div style="grid-column:1 / -1; display:flex; justify-content:space-between; align-items:center;">
          <div id="supabaseStatusMsg" style="font-size:0.85rem; font-weight:bold;"></div>
          <div style="display:flex; gap:10px;">
            <button type="button" onclick="testSupabaseConnection()" class="cad-btn cad-btn-secondary" style="font-size:0.85rem; background:#334155; color:#fff;">🧪 Test Connection</button>
            <button type="submit" class="cad-btn cad-btn-primary" style="font-size:0.85rem; background:#10B981; border-color:#10B981;">💾 Save & Activate Supabase</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <script>
    function testSupabaseConnection() {
      const url = document.getElementById('supabaseUrlInput').value.trim();
      const key = document.getElementById('supabaseKeyInput').value.trim();
      const msg = document.getElementById('supabaseStatusMsg');
      if (!url || !key) {
        alert('Please enter both Supabase Project URL and API Key.');
        return;
      }
      msg.style.color = '#38BDF8';
      msg.innerText = 'Connecting to Supabase Cloud API...';
      fetch('/api/admin/supabase-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          msg.style.color = '#10B981';
          msg.innerText = '✓ ' + (res.message || 'Connected to Supabase successfully!');
        } else {
          msg.style.color = '#EF4444';
          msg.innerText = '✕ Connection Failed: ' + (res.error || 'Check URL/Key');
        }
      })
      .catch(err => {
        msg.style.color = '#EF4444';
        msg.innerText = '✕ Error: ' + err.message;
      });
    }

    function saveSupabaseConfig(e) {
      e.preventDefault();
      const url = document.getElementById('supabaseUrlInput').value.trim();
      const key = document.getElementById('supabaseKeyInput').value.trim();
      fetch('/api/admin/supabase-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, key, active: url && key ? 1 : 0 })
      })
      .then(r => r.json())
      .then(res => {
        alert('Supabase configuration saved! Reloading...');
        window.location.reload();
      });
    }
    function verifyOrder(id) {
      if (!confirm('Approve payment for Order #' + id + '? This will immediately unlock the customer\\'s digital CAD download files.')) return;
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id })
      }).then(() => window.location.reload());
    }

    function rejectOrder(id) {
      if (!confirm('Reject this transaction ID as invalid?')) return;
      fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id })
      }).then(() => window.location.reload());
    }

    function saveSettings(e) {
      e.preventDefault();
      const form = e.target;
      const payload = {
        brandName: form.brandName.value,
        phone: form.phone.value,
        whatsapp: form.whatsapp.value,
        email: form.email.value,
        bkashNo: form.bkashNo.value,
        nagadNo: form.nagadNo.value,
        rocketNo: form.rocketNo.value
      };
      fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(() => alert('All settings successfully saved to SQLite database!'));
    }

    function runSqlQuery() {
      const query = document.getElementById('sqlInput').value;
      const out = document.getElementById('sqlOutput');
      out.style.display = 'block';
      out.innerText = 'Executing query on SQLite...';

      fetch('/api/admin/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          out.innerText = JSON.stringify(data.results, null, 2);
        } else {
          out.innerText = 'SQL Error: ' + data.error;
        }
      })
      .catch(err => {
        out.innerText = 'Network error: ' + err.message;
      });
    }
  </script>
</body>
</html>`;
}

// Dedicated Web Database Manager Page (phpMyAdmin Replacement)
function renderDatabasePage() {
  const tables = db.getTablesInfo();
  const stats = db.getStats();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoCad ConsumeR — Web Database Manager (phpMyAdmin Alternative)</title>
  <link rel="stylesheet" href="/theme/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #0F172A; color: #F1F5F9; margin: 0; padding: 0; display: flex; flex-direction: column; height: 100vh; }
    .db-topbar { background: #0B1220; border-bottom: 1px solid #1E293B; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .db-brand { display: flex; align-items: center; gap: 12px; }
    .db-brand img { height: 36px; }
    .db-brand-title { font-weight: 800; font-size: 1.15rem; color: #FFFFFF; }
    .db-badge { background: #10B981; color: #FFFFFF; font-size: 0.75rem; font-weight: bold; padding: 3px 8px; border-radius: 4px; }
    .db-layout { display: flex; flex: 1; overflow: hidden; }
    .db-sidebar { width: 280px; background: #1E293B; border-right: 1px solid #334155; padding: 18px 0; display: flex; flex-direction: column; }
    .db-sidebar-header { padding: 0 18px 14px; border-bottom: 1px solid #334155; font-size: 0.8rem; font-weight: bold; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
    .db-tree { list-style: none; padding: 0; margin: 10px 0; overflow-y: auto; flex: 1; }
    .db-tree-item { padding: 10px 18px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: #CBD5E1; transition: background 0.15s; font-size: 0.9rem; }
    .db-tree-item:hover, .db-tree-item.active { background: #334155; color: #38BDF8; font-weight: 600; }
    .db-tree-badge { background: #0F172A; color: #94A3B8; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; padding: 2px 6px; border-radius: 10px; }
    .db-main { flex: 1; display: flex; flex-direction: column; background: #0F172A; overflow: hidden; }
    .db-main-header { background: #1E293B; padding: 14px 24px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .db-tabs { display: flex; gap: 8px; }
    .db-tab-btn { background: #334155; border: 1px solid #475569; color: #CBD5E1; padding: 6px 14px; border-radius: 4px; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
    .db-tab-btn.active { background: #38BDF8; color: #0F172A; border-color: #38BDF8; }
    .db-content { flex: 1; overflow: auto; padding: 24px; }
    .db-table-wrap { background: #1E293B; border-radius: 8px; border: 1px solid #334155; overflow: auto; max-height: 100%; }
    table.db-grid { width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; }
    table.db-grid th { background: #0F172A; color: #38BDF8; padding: 12px 14px; font-weight: 700; border-bottom: 2px solid #334155; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; position: sticky; top: 0; }
    table.db-grid td { padding: 10px 14px; border-bottom: 1px solid #334155; color: #E2E8F0; }
    table.db-grid tr:hover td { background: rgba(56, 189, 248, 0.05); }
    .db-sql-editor { width: 100%; height: 120px; background: #0F172A; border: 1px solid #334155; color: #38BDF8; font-family: 'JetBrains Mono', monospace; padding: 12px; border-radius: 6px; font-size: 0.9rem; resize: vertical; }
  </style>
</head>
<body>
  <!-- Topbar -->
  <div class="db-topbar">
    <div class="db-brand">
      <img src="/theme/assets/images/logo.png" alt="AutoCad ConsumeR">
      <span class="db-brand-title">Web Database Manager</span>
      <span class="db-badge">SQLite 3 WAL Active</span>
    </div>
    <div style="display:flex; gap:10px; align-items:center;">
      <span style="font-size:0.8rem; color:#94A3B8; font-family:'JetBrains Mono', monospace;">File: autocad_consumer.sqlite (${stats.dbSize})</span>
      <a href="/api/admin/download-db" class="db-tab-btn" style="text-decoration:none; background:#10B981; color:#fff; border-color:#10B981;">💾 Download .sqlite</a>
      <a href="/api/admin/download-mysql" class="db-tab-btn" style="text-decoration:none; background:#F59E0B; color:#000; border-color:#F59E0B;">📥 Export MySQL (.sql)</a>
      <a href="/api/admin/download-supabase" class="db-tab-btn" style="text-decoration:none; background:#3ECF8E; color:#0B1220; font-weight:bold; border-color:#3ECF8E;">⚡ Export Supabase (.sql)</a>
      <a href="/admin" class="db-tab-btn" style="text-decoration:none;">⚙️ Store Admin</a>
      <a href="/" class="db-tab-btn" style="text-decoration:none;">Storefront →</a>
    </div>
  </div>

  <!-- Layout -->
  <div class="db-layout">
    <!-- Sidebar -->
    <div class="db-sidebar">
      <div class="db-sidebar-header">
        Database: autocad_consumer
      </div>
      <ul class="db-tree" id="tableList">
        ${tables.map((t, idx) => `
          <li class="db-tree-item ${idx === 0 ? 'active' : ''}" onclick="switchTable('${t.name}', this)">
            <span>🗎 ${t.name}</span>
            <span class="db-tree-badge">${t.count}</span>
          </li>
        `).join('')}
      </ul>
      <div style="padding:14px 18px; border-top:1px solid #334155; font-size:0.75rem; color:#64748B;">
        Zero-setup standalone database. Runs directly on Node.js port 3000.
      </div>
    </div>

    <!-- Main Content -->
    <div class="db-main">
      <div class="db-main-header">
        <div>
          <h2 id="currentTableTitle" style="margin:0; font-size:1.25rem; color:#FFFFFF;">Table: products</h2>
          <span id="currentTableSub" style="font-size:0.8rem; color:#94A3B8;">Showing active rows in database</span>
        </div>
        <div class="db-tabs">
          <button class="db-tab-btn active" onclick="switchView('browse', this)">Browse Data</button>
          <button class="db-tab-btn" onclick="switchView('structure', this)">Structure</button>
          <button class="db-tab-btn" onclick="switchView('sql', this)">SQL Console</button>
        </div>
      </div>

      <div class="db-content" id="dbContentArea">
        <div class="db-table-wrap" id="tableContainer">
          <div style="padding:40px; text-align:center; color:#94A3B8;">Loading table data...</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentTable = 'products';
    let currentView = 'browse';
    let tableDataCache = {};

    function switchTable(name, el) {
      document.querySelectorAll('.db-tree-item').forEach(item => item.classList.remove('active'));
      if (el) el.classList.add('active');
      currentTable = name;
      document.getElementById('currentTableTitle').innerText = 'Table: ' + name;
      loadTableData();
    }

    function switchView(view, btn) {
      document.querySelectorAll('.db-tabs .db-tab-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      currentView = view;
      renderCurrentView();
    }

    function loadTableData() {
      fetch('/api/db/table-data?table=' + currentTable)
        .then(res => res.json())
        .then(data => {
          tableDataCache = data;
          renderCurrentView();
        });
    }

    function renderCurrentView() {
      const container = document.getElementById('tableContainer');
      if (!tableDataCache || !tableDataCache.columns) {
        container.innerHTML = '<div style="padding:40px; text-align:center;">Loading...</div>';
        return;
      }

      if (currentView === 'browse') {
        const cols = tableDataCache.columns;
        const rows = tableDataCache.rows;

        if (rows.length === 0) {
          container.innerHTML = '<div style="padding:40px; text-align:center; color:#94A3B8;">Table <strong>' + currentTable + '</strong> has 0 rows.</div>';
          return;
        }

        let html = '<table class="db-grid"><thead><tr><th>#</th>';
        cols.forEach(c => {
          html += '<th>' + c.name + ' <small style="color:#64748B;">(' + c.type + ')</small></th>';
        });
        html += '<th>Actions</th></tr></thead><tbody>';

        rows.forEach((r, idx) => {
          html += '<tr><td>' + (idx + 1) + '</td>';
          cols.forEach(c => {
            let val = r[c.name];
            if (typeof val === 'object') val = JSON.stringify(val);
            if (typeof val === 'string' && val.length > 55) val = val.substring(0, 52) + '...';
            html += '<td style="font-family:' + (c.name.includes('id') || c.name.includes('price') || c.name.includes('total') ? 'monospace' : 'inherit') + ';">' + (val !== null && val !== undefined ? String(val) : '<span style="color:#64748B;">NULL</span>') + '</td>';
          });
          const pkCol = cols.find(c => c.pk === 1) || cols[0];
          html += '<td style="white-space:nowrap;">';
          if (currentTable === 'settings') {
            html += '<button onclick="editSettingAction(\\'' + r.key + '\\', \\'' + (r.value || '').replace(/'/g, "\\'") + '\\')" style="background:#0284C7; border:none; color:#fff; border-radius:3px; padding:3px 8px; font-size:0.75rem; cursor:pointer; margin-right:4px;">✏️ Edit</button>';
          } else {
            html += '<button onclick="editRowAction(\\'' + currentTable + '\\', \\'' + pkCol.name + '\\', \\'' + r[pkCol.name] + '\\')" style="background:#0284C7; border:none; color:#fff; border-radius:3px; padding:3px 8px; font-size:0.75rem; cursor:pointer; margin-right:4px;">✏️ Edit</button>';
          }
          html += '<button onclick="deleteRowAction(\\'' + currentTable + '\\', \\'' + pkCol.name + '\\', \\'' + r[pkCol.name] + '\\')" style="background:#EF4444; border:none; color:#fff; border-radius:3px; padding:3px 8px; font-size:0.75rem; cursor:pointer;">Delete</button>';
          html += '</td></tr>';
        });

        html += '</tbody></table>';

        let headerBar = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">';
        headerBar += '<span style="font-size:0.85rem; color:#94A3B8;">Total Rows: <strong>' + rows.length + '</strong></span>';
        if (currentTable === 'settings') {
          headerBar += '<button onclick="addSettingAction()" style="background:#10B981; border:none; color:#fff; border-radius:4px; padding:6px 14px; font-weight:700; font-size:0.8rem; cursor:pointer;">➕ Add New Setting</button>';
        }
        headerBar += '</div>';

        container.innerHTML = headerBar + html;
      } else if (currentView === 'structure') {
        const cols = tableDataCache.columns;
        let html = '<table class="db-grid"><thead><tr><th>CID</th><th>Column Name</th><th>Type</th><th>Not Null</th><th>Default Value</th><th>Primary Key</th></tr></thead><tbody>';
        cols.forEach(c => {
          html += '<tr>';
          html += '<td>' + c.cid + '</td>';
          html += '<td style="font-weight:bold; color:#38BDF8;">' + c.name + '</td>';
          html += '<td><code>' + c.type + '</code></td>';
          html += '<td>' + (c.notnull ? 'YES' : 'NO') + '</td>';
          html += '<td>' + (c.dflt_value !== null ? c.dflt_value : 'NULL') + '</td>';
          html += '<td>' + (c.pk ? '<span style="background:#F59E0B; color:#000; padding:2px 6px; border-radius:3px; font-weight:bold; font-size:0.7rem;">PRI</span>' : '') + '</td>';
          html += '</tr>';
        });
        html += '</tbody></table>';
        container.innerHTML = html;
      } else if (currentView === 'sql') {
        container.innerHTML = \`
          <div style="padding:20px;">
            <h3 style="margin-top:0;">Run Custom SQL on \${currentTable}</h3>
            <textarea id="customSqlBox" class="db-sql-editor">SELECT * FROM \${currentTable} LIMIT 20</textarea>
            <div style="margin-top:10px; margin-bottom:12px; display:flex; flex-wrap:wrap; gap:8px;">
              <span style="font-size:0.78rem; color:#94A3B8; align-self:center;">Settings Quick Queries:</span>
              <button onclick="document.getElementById('customSqlBox').value='SELECT * FROM settings;'; executeCustomSql();" class="db-tab-btn" style="font-size:0.75rem; padding:4px 8px;">View All Settings</button>
              <button onclick="document.getElementById('customSqlBox').value='UPDATE settings SET value = \\'01878205459\\' WHERE key = \\'bkashNo\\';'; executeCustomSql();" class="db-tab-btn" style="font-size:0.75rem; padding:4px 8px;">Update bKash</button>
              <button onclick="document.getElementById('customSqlBox').value='UPDATE settings SET value = \\'01878205459\\' WHERE key = \\'nagadNo\\';'; executeCustomSql();" class="db-tab-btn" style="font-size:0.75rem; padding:4px 8px;">Update Nagad</button>
              <button onclick="document.getElementById('customSqlBox').value='UPDATE settings SET value = \\'AutoCad ConsumeR\\' WHERE key = \\'brandName\\';'; executeCustomSql();" class="db-tab-btn" style="font-size:0.75rem; padding:4px 8px;">Update Brand</button>
            </div>
            <div style="margin-top:12px; display:flex; justify-content:space-between;">
              <button onclick="executeCustomSql()" style="background:#10B981; border:none; color:#fff; padding:8px 18px; border-radius:4px; font-weight:bold; cursor:pointer;">▶ Execute Query</button>
              <div style="display:flex; gap:8px;">
                <button onclick="document.getElementById('customSqlBox').value='SELECT count(*) as total FROM \${currentTable}'; executeCustomSql();" class="db-tab-btn">COUNT(*)</button>
                <button onclick="document.getElementById('customSqlBox').value='PRAGMA table_info(\${currentTable})'; executeCustomSql();" class="db-tab-btn">Table Info</button>
              </div>
            </div>
            <div id="sqlResultBox" style="margin-top:18px; display:none; background:#0B1220; padding:14px; border-radius:6px; font-family:monospace; font-size:0.85rem; color:#38BDF8; max-height:300px; overflow:auto;"></div>
          </div>
        \`;
      }
    }

    function editSettingAction(key, currentVal) {
      const newVal = prompt("Enter new value for setting '" + key + "':", currentVal);
      if (newVal === null) return;
      fetch('/api/db/update-cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'settings',
          pkCol: 'key',
          pkVal: key,
          colName: 'value',
          newVal: newVal
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          loadTableData();
        } else {
          alert('Error: ' + (res.error || 'Failed to update setting'));
        }
      });
    }

    function addSettingAction() {
      const key = prompt("Enter new Setting Key (e.g. delivery_note, helpline_hours, discount_code):");
      if (!key) return;
      const value = prompt("Enter Value for '" + key + "':");
      if (value === null) return;
      fetch('/api/db/insert-row', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'settings',
          rowData: { key: key.trim(), value: value.trim() }
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          loadTableData();
        } else {
          alert('Error: ' + (res.error || 'Failed to add setting'));
        }
      });
    }

    function editRowAction(table, pkCol, pkVal) {
      const colName = prompt("Enter the column name to edit (e.g. price, title, status):");
      if (!colName) return;
      const newVal = prompt("Enter new value for '" + colName + "' where " + pkCol + " = " + pkVal + ":");
      if (newVal === null) return;
      fetch('/api/db/update-cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: table,
          pkCol: pkCol,
          pkVal: pkVal,
          colName: colName.trim(),
          newVal: newVal
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          loadTableData();
        } else {
          alert('Error: ' + (res.error || 'Failed to update row'));
        }
      });
    }

    function deleteRowAction(table, pkCol, pkVal) {
      if (!confirm('Are you sure you want to delete row with ' + pkCol + ' = ' + pkVal + ' from ' + table + '?')) return;
      fetch('/api/db/delete-row', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, pkCol, pkVal })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          loadTableData();
        } else {
          alert('Error: ' + res.error);
        }
      });
    }

    function executeCustomSql() {
      const q = document.getElementById('customSqlBox').value;
      const box = document.getElementById('sqlResultBox');
      box.style.display = 'block';
      box.innerText = 'Running query...';

      fetch('/api/admin/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          box.innerText = JSON.stringify(data.results, null, 2);
        } else {
          box.innerText = 'SQL Error: ' + data.error;
        }
      });
    }

    // Initial load
    loadTableData();
  </script>
</body>
</html>`;
}

// Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Static Assets from Theme: /theme/...
  if (pathname.startsWith('/theme/')) {
    const relPath = pathname.replace('/theme/', '');
    const fullPath = path.join(THEME_DIR, relPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      res.writeHead(200, { 'Content-Type': getMimeType(fullPath) });
      fs.createReadStream(fullPath).pipe(res);
      return;
    }
  }

  // Static Assets from Core: /core/...
  if (pathname.startsWith('/core/')) {
    const relPath = pathname.replace('/core/', '');
    const fullPath = path.join(CORE_DIR, relPath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      res.writeHead(200, { 'Content-Type': getMimeType(fullPath) });
      fs.createReadStream(fullPath).pipe(res);
      return;
    }
  }

  // API Endpoints
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let data = {};
      try { data = JSON.parse(body); } catch(e) {}

      if (pathname === '/api/cart/add') {
        const prod = db.getProductById(data.id);
        if (prod) {
          const varName = data.variation || 'Standard Package';
          const price = data.price || prod.salePrice;
          const existing = sessionCart.find(c => c.id === prod.id && c.variation === varName);
          if (existing) {
            existing.qty += 1;
          } else {
            sessionCart.push({
              id: prod.id,
              title: prod.title,
              variation: varName,
              price: price,
              qty: 1,
              img: prod.img
            });
          }
        }
        const subtotal = sessionCart.reduce((a, b) => a + (b.price * b.qty), 0);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, cart: sessionCart, subtotal }));
        return;
      }

      if (pathname === '/api/cart/qty') {
        const item = sessionCart[data.index];
        if (item) {
          item.qty = Math.max(1, item.qty + data.delta);
        }
        const subtotal = sessionCart.reduce((a, b) => a + (b.price * b.qty), 0);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, cart: sessionCart, subtotal }));
        return;
      }

      if (pathname === '/api/cart/remove') {
        sessionCart.splice(data.index, 1);
        const subtotal = sessionCart.reduce((a, b) => a + (b.price * b.qty), 0);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, cart: sessionCart, subtotal }));
        return;
      }

      // Order Placement -> Persists to SQLite Database!
      if (pathname === '/api/order/place') {
        const methodStr = data.method === 'bkash' ? 'bKash Send Money' : (data.method === 'nagad' ? 'Nagad Send Money' : (data.method === 'rocket' ? 'Rocket' : 'Cash on Delivery'));
        const newOrderId = db.createOrder({
          name: data.name,
          phone: data.phone,
          email: data.email,
          company: data.company,
          address: data.address,
          method: methodStr,
          trxId: data.trxId,
          senderNumber: data.senderNumber
        }, sessionCart);

        sessionCart = []; // clear cart
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, orderId: newOrderId }));
        return;
      }

      // Order Verification
      if (pathname === '/api/admin/verify') {
        db.verifyOrder(data.orderId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }

      // Order Rejection
      if (pathname === '/api/admin/reject') {
        db.rejectOrder(data.orderId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }

      // Update Settings
      if (pathname === '/api/admin/settings') {
        db.updateSettings(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Settings saved to SQLite' }));
        return;
      }

      // Supabase Connection Test
      if (pathname === '/api/admin/supabase-test') {
        db.testSupabase(data.url, data.key)
          .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          })
          .catch(err => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          });
        return;
      }

      // Supabase Configuration Save
      if (pathname === '/api/admin/supabase-save') {
        db.updateSettings({
          supabaseUrl: data.url ? data.url.trim() : '',
          supabaseKey: data.key ? data.key.trim() : '',
          supabaseActive: data.active ? '1' : '0'
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Supabase configuration saved.' }));
        return;
      }

      // Custom Quote Submission
      if (pathname === '/api/quote/submit') {
        db.addQuote(data.name, data.phone, data.email, data.service, data.scope, '');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }

      // Database GUI: Delete Row
      if (pathname === '/api/db/delete-row') {
        try {
          db.deleteRow(data.table, data.pkCol, data.pkVal);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      // Database GUI: Update Row Cell
      if (pathname === '/api/db/update-cell') {
        try {
          db.updateCell(data.table, data.pkCol, data.pkVal, data.colName, data.newVal);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Cell updated successfully' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      // Database GUI: Insert Row
      if (pathname === '/api/db/insert-row') {
        try {
          db.insertRow(data.table, data.rowData);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Row inserted successfully' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }

      // Live SQL Console Endpoint
      if (pathname === '/api/admin/sql') {
        try {
          const results = db.executeRawSql(data.query);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, results }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
      }
    });
    return;
  }

  // GET API: Table Data for Database Manager
  if (pathname === '/api/db/table-data') {
    const table = parsedUrl.query.table || 'products';
    const data = db.getTableData(table);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // GET API: Order Status Polling
  if (pathname === '/api/order/status') {
    const orderId = parsedUrl.query.order;
    const order = db.getOrderById(orderId);
    if (order) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        orderId: order.orderId,
        verified: order.verified,
        status: order.status
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Order not found' }));
    }
    return;
  }

  // GET API: Secure Digital CAD File Download (Gated by Admin Verification)
  if (pathname === '/api/download') {
    const orderId = parsedUrl.query.order;
    const productId = parseInt(parsedUrl.query.id, 10);
    const order = db.getOrderById(orderId);

    if (!order) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Order Not Found</h1><p>We could not find order record: ' + (orderId || '') + '</p>');
      return;
    }

    if (!order.verified) {
      res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Download Locked — AutoCad ConsumeR</title>
          <style>
            body { font-family:'Segoe UI', sans-serif; background:#0B1220; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
            .box { background:#151F32; border:1px solid #E50914; border-radius:12px; padding:36px; max-width:540px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.5); }
            h2 { color:#EF4444; margin-top:0; }
            p { color:#94A3B8; line-height:1.6; }
            .badge { background:rgba(239,68,68,0.15); color:#FCA5A5; padding:6px 14px; border-radius:20px; font-weight:bold; font-size:0.85rem; display:inline-block; margin-bottom:16px; }
            .btn { display:inline-block; margin-top:20px; background:#1769AA; color:#fff; text-decoration:none; padding:10px 20px; border-radius:6px; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="badge">🔒 SECURITY RESTRICTION: PAYMENT PENDING</div>
            <h2>Download Access Locked</h2>
            <p>Order <strong>#${order.orderId}</strong> has not been approved by the AutoCad ConsumeR verification officer yet.</p>
            <p>Your submitted transaction details (TrxID: <code>${order.trxId}</code>) are currently under audit in the database. Once approved in the administration portal, file download will unlock automatically.</p>
            <a href="/order-received?order=${order.orderId}" class="btn">Return to Order Status Page</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const item = order.itemsList ? order.itemsList.find(i => i.id === productId) : null;
    const prod = item || db.getProductById(productId) || db.getProducts()[0];
    const fileName = prod.file || 'cad-blocks-bundle.zip';
    const filePath = path.join(DOWNLOADS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="' + (prod.downloadName || fileName) + '"'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File archive currently updating on server.');
      return;
    }
  }

  // Backup SQLite Download
  if (pathname === '/api/admin/download-db') {
    if (fs.existsSync(DB_FILE)) {
      const stat = fs.statSync(DB_FILE);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.sqlite3',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="autocad_consumer.sqlite"'
      });
      fs.createReadStream(DB_FILE).pipe(res);
      return;
    }
  }

  // Export MySQL Dump Download
  if (pathname === '/api/admin/download-mysql') {
    if (fs.existsSync(MYSQL_FILE)) {
      const stat = fs.statSync(MYSQL_FILE);
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="autocad_consumer_mysql.sql"'
      });
      fs.createReadStream(MYSQL_FILE).pipe(res);
      return;
    }
  }

  // Export Supabase PostgreSQL Dump Download
  if (pathname === '/api/admin/download-supabase') {
    if (fs.existsSync(SUPABASE_FILE)) {
      const stat = fs.statSync(SUPABASE_FILE);
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="autocad_consumer_supabase.sql"'
      });
      fs.createReadStream(SUPABASE_FILE).pipe(res);
      return;
    }
  }

  // HTML Pages
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderHomePage());
    return;
  }

  if (pathname === '/checkout') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderCheckoutPage());
    return;
  }

  if (pathname === '/order-received') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderOrderReceived(parsedUrl.query.order));
    return;
  }

  if (pathname === '/admin') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderAdminPage());
    return;
  }

  // Built-in Web Database Manager (phpMyAdmin Alternative)
  if (pathname === '/database' || pathname === '/db' || pathname === '/phpmyadmin') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderDatabasePage());
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404 Not Found</h1><p><a href="/">Return Home</a></p>');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AutoCad ConsumeR Server LIVE on: http://localhost:${PORT}`);
  console.log(`Web Database Manager: http://localhost:${PORT}/database`);
  console.log(`Admin Verification Console: http://localhost:${PORT}/admin`);
  console.log(`Persistent Database File: ${DB_FILE}`);
});

// Port 80 auto-redirector: enables instant access via http://localhost or http://localhost/phpmyadmin
try {
  const redirect80 = http.createServer((req, res) => {
    res.writeHead(302, { 'Location': `http://localhost:${PORT}${req.url}` });
    res.end();
  });
  redirect80.on('error', (err) => {
    // If port 80 is unavailable or restricted, silently continue on port 3000
    console.log(`Port 80 redirector note: ${err.message}`);
  });
  redirect80.listen(80, '127.0.0.1', () => {
    console.log(`Port 80 redirector active: http://localhost/phpmyadmin -> http://localhost:${PORT}/phpmyadmin`);
  });
} catch (e) {
  // Silent fallback
}
