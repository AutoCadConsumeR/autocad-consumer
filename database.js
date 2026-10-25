/**
 * AutoCad ConsumeR — SQLite Database Driver & Data Layer
 * Pure Node.js SQLite driver using built-in 'node:sqlite'
 * Zero external dependencies. ACID compliant persistent storage.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const https = require('https');

const isVercel = Boolean(process.env.VERCEL);
const DB_PATH = isVercel
  ? path.join('/tmp', 'autocad_consumer.sqlite')
  : path.join(__dirname, 'autocad_consumer.sqlite');

if (isVercel && !fs.existsSync(DB_PATH)) {
  const seedPath = path.join(__dirname, 'autocad_consumer.sqlite');
  if (fs.existsSync(seedPath)) {
    try { fs.copyFileSync(seedPath, DB_PATH); } catch (e) {}
  }
}

const sqlite = new DatabaseSync(DB_PATH);

// Configure WAL mode for high performance and concurrency
sqlite.exec('PRAGMA journal_mode = WAL;');
sqlite.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    item_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    cat_name TEXT NOT NULL,
    price REAL NOT NULL,
    sale_price REAL NOT NULL,
    rating REAL DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    in_stock INTEGER DEFAULT 1,
    featured INTEGER DEFAULT 0,
    img TEXT NOT NULL,
    file TEXT NOT NULL,
    download_name TEXT NOT NULL,
    file_size TEXT NOT NULL,
    format TEXT NOT NULL,
    description TEXT NOT NULL,
    specs_json TEXT,
    variations_json TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    address TEXT,
    items_summary TEXT NOT NULL,
    total REAL NOT NULL,
    method TEXT NOT NULL,
    trx_id TEXT NOT NULL,
    sender_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending Verification',
    verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    product_title TEXT NOT NULL,
    variation TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL,
    file TEXT NOT NULL,
    download_name TEXT NOT NULL,
    file_size TEXT NOT NULL,
    format TEXT NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    scope TEXT NOT NULL,
    file_name TEXT,
    created_at TEXT NOT NULL
  );
`);

// Seed Default Settings if empty
const settingsCount = sqlite.prepare('SELECT COUNT(*) as cnt FROM settings').get().cnt;
if (settingsCount === 0) {
  const insertSetting = sqlite.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  const defaultSettings = [
    ['brandName', 'AutoCad ConsumeR'],
    ['phone', '+880 1878-205459'],
    ['whatsapp', '01878205459'],
    ['email', 'support@autocadconsumer.com'],
    ['address', 'Engineering Tower, Level 4, Panthapath, Dhaka-1205, Bangladesh'],
    ['bkashNo', '01878205459'],
    ['nagadNo', '01878205459'],
    ['rocketNo', '01878205459']
  ];
  defaultSettings.forEach(([k, v]) => insertSetting.run(k, v));
}

// Seed Default Products if empty
const productsCount = sqlite.prepare('SELECT COUNT(*) as cnt FROM products').get().cnt;
if (productsCount === 0) {
  const insertProduct = sqlite.prepare(`
    INSERT INTO products (
      id, title, category, cat_name, price, sale_price, rating, reviews,
      in_stock, featured, img, file, download_name, file_size, format,
      description, specs_json, variations_json
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const initialProducts = [
    {
      id: 101,
      title: 'Master Architectural CAD Block Bundle (1,500+ Blocks)',
      category: 'cad-blocks',
      cat_name: 'CAD Blocks & Symbols',
      price: 1200,
      sale_price: 899,
      rating: 4.9,
      reviews: 38,
      in_stock: 1,
      featured: 1,
      img: '/theme/assets/images/placeholders/cad-blocks.svg',
      file: 'cad-blocks-bundle.zip',
      download_name: 'AutoCad-ConsumeR-Master-Blocks-1500.zip',
      file_size: '3.2 MB',
      format: '.DWG / .DXF / Dynamic Blocks',
      description: 'Extensive 2D collection: living room furniture, commercial sanitary fixtures, kitchen modules, landscaping, electrical symbols, dynamic doors & windows.',
      specs: {
        format: '.DWG (AutoCAD 2007–2025) + .DXF',
        scale: '1:1 Metric (mm) & Imperial',
        layers: 'AIA Standard Color-Coded Layers',
        blocks: '1,500+ Dynamic & Static CAD Blocks',
        delivery: 'Instant ZIP Archive Download (3.2 MB)'
      },
      variations: [
        { name: 'Starter Pack (250 Basic Blocks)', price: 499 },
        { name: 'Professional Pack (750 Blocks)', price: 899, default: true },
        { name: 'Master Bureau Suite (1,500+ Blocks + Commercial License)', price: 1450 }
      ]
    },
    {
      id: 102,
      title: 'Standard DWG/DXF Title Block & Sheet Templates (A0 to A4)',
      category: 'templates',
      cat_name: 'DWG/DXF Templates',
      price: 650,
      sale_price: 499,
      rating: 5.0,
      reviews: 24,
      in_stock: 1,
      featured: 1,
      img: '/theme/assets/images/placeholders/dwg-template.svg',
      file: 'dwg-sheet-templates.zip',
      download_name: 'AutoCad-ConsumeR-Title-Sheets-A0-A4.zip',
      file_size: '2.6 MB',
      format: '.DWG / .DXF / CTB Plot Styles',
      description: 'Standardized drawing sheets compliant with ISO and ANSI specifications. Includes dynamic viewports and calibrated monochrome CTB plot files.',
      specs: {
        format: '.DWG, .DXF, .DWT Template File',
        scale: 'A0, A1, A2, A3, A4 Sheet Sizes',
        layers: 'ISO Standard Drawing Borders & Title Fields',
        blocks: 'Dynamic Revision & Approval Stamps',
        delivery: 'Instant ZIP with CTB Pen Plot Styles (2.6 MB)'
      },
      variations: [
        { name: 'Single Sheet Template (A3/A4)', price: 299 },
        { name: 'Full ISO Metric Suite (A0-A4 + CTB Styles)', price: 499, default: true },
        { name: 'Corporate Enterprise Kit (Metric + Imperial + Font Pack)', price: 850 }
      ]
    },
    {
      id: 103,
      title: 'Residential Villa Multi-Story Architectural Drawing Set',
      category: 'architectural',
      cat_name: 'Architectural Drafting',
      price: 2500,
      sale_price: 1850,
      rating: 4.8,
      reviews: 19,
      in_stock: 1,
      featured: 1,
      img: '/theme/assets/images/placeholders/architectural-plans.svg',
      file: 'architectural-villa-plans.zip',
      download_name: 'AutoCad-ConsumeR-Duplex-Villa-Architectural-Set.zip',
      file_size: '2.5 MB',
      format: '.DWG / .DXF / Vector PDF Sheets',
      description: 'Complete residential design: ground & typical floor plans, 4-side elevations, sectional details, staircase layouts, and roof drainage details.',
      specs: {
        format: '.DWG + Layered Vector PDF Sheets',
        scale: '1:100 Metric Architectural Scale',
        layers: 'Structured Wall, Opening, Furniture, Text Layers',
        sheets: '12 Full Presentation & Working Drawing Sheets',
        delivery: 'Instant Download ZIP (2.5 MB)'
      },
      variations: [
        { name: 'Floor Plans Only (Ground + First)', price: 950 },
        { name: 'Complete 12-Sheet Architectural Set', price: 1850, default: true },
        { name: 'Architectural + Structural Framing Bundle', price: 2800 }
      ]
    },
    {
      id: 104,
      title: 'Reinforced Concrete Structural Detailing DWG Library',
      category: 'structural',
      cat_name: 'Structural Drawing Resources',
      price: 1800,
      sale_price: 1350,
      rating: 4.9,
      reviews: 42,
      in_stock: 1,
      featured: 1,
      img: '/theme/assets/images/placeholders/structural-steel.svg',
      file: 'structural-rebar-library.zip',
      download_name: 'AutoCad-ConsumeR-RC-Structural-Rebar-Library.zip',
      file_size: '2.0 MB',
      format: '.DWG / .DXF / BNBC & ACI Details',
      description: 'Rebar detailing standards: column schedules, continuous beam cross-sections, isolated footings, shear walls, and steel gusset connections.',
      specs: {
        format: '.DWG (BNBC & ACI 318 Standard Details)',
        scale: '1:20 & 1:50 Detailing Scale',
        layers: 'Rebar, Stirrup, Concrete, Dimension Layers',
        elements: 'Footings, Columns, Beams, Slabs, Retaining Walls',
        delivery: 'Instant ZIP Download (2.0 MB)'
      },
      variations: [
        { name: 'Foundation & Footing Details Pack', price: 650 },
        { name: 'Complete Rebar Detailing Library (All Elements)', price: 1350, default: true },
        { name: 'Structural Detailing + Excel BBS Bar Bending Tool', price: 1950 }
      ]
    },
    {
      id: 105,
      title: 'Building Construction BOQ & Rate Analysis Estimator',
      category: 'boq-tools',
      cat_name: 'BOQ & Estimation Tools',
      price: 950,
      sale_price: 750,
      rating: 4.7,
      reviews: 15,
      in_stock: 1,
      featured: 0,
      img: '/theme/assets/images/placeholders/boq-estimator.svg',
      file: 'boq-rate-analysis-bangladesh.zip',
      download_name: 'AutoCad-ConsumeR-BOQ-Estimator-PWD-LGED.zip',
      file_size: '1.2 MB',
      format: '.CSV / .XLSX / Formulas Included',
      description: 'Automated Excel sheet with linked formulas, material quantity takeoffs, and rate analysis according to Bangladesh PWD/LGED schedules.',
      specs: {
        format: '.XLSX Automated Matrix Spreadsheet + .DWG Takeoff Guide',
        scale: 'Pre-formatted for Bangladeshi Building Projects',
        features: 'Dynamic Material Takeoff, Labor Rates, Equipment Costs',
        standards: 'PWD / LGED Schedule of Rates Compatible',
        delivery: 'Instant Spreadsheet & Documentation (1.2 MB)'
      },
      variations: [
        { name: 'Residential BOQ Template Only', price: 450 },
        { name: 'Complete Master BOQ & Rate Analysis Tool', price: 750, default: true },
        { name: 'Master BOQ + Material Specification Handbook', price: 1100 }
      ]
    },
    {
      id: 106,
      title: '2D CAD Drafting & PDF-to-CAD Conversion Service (Per Sheet)',
      category: 'services',
      cat_name: 'Custom CAD Design Services',
      price: 1800,
      sale_price: 1500,
      rating: 5.0,
      reviews: 57,
      in_stock: 1,
      featured: 0,
      img: '/theme/assets/images/placeholders/drafting-service.svg',
      file: 'cad-drafting-service-brief.zip',
      download_name: 'AutoCad-ConsumeR-Drafting-Service-Brief.zip',
      file_size: '930 KB',
      format: '.DWG / .DXF / Service Brief & Instructions',
      description: 'Order professional 2D drafting for your architectural or structural sheet. Includes up to 2 revisions and delivery in both native .DWG and vector .PDF.',
      specs: {
        format: 'Custom Native .DWG + Print-ready .PDF + CTB',
        scale: 'Custom Architectural / Engineering Scale',
        turnaround: '24 to 48 Hours Standard Delivery',
        revisions: '2 Free Iterative Revisions Included',
        delivery: 'Digital Transfer via Download Link'
      },
      variations: [
        { name: 'Simple Drawing / Conversion (1 Sheet)', price: 800 },
        { name: 'Standard Working Drawing Sheet (1 Sheet)', price: 1500, default: true },
        { name: 'Complex Detailing / Large Format A0 Sheet', price: 2500 }
      ]
    }
  ];

  initialProducts.forEach(p => {
    insertProduct.run(
      p.id, p.title, p.category, p.cat_name, p.price, p.sale_price, p.rating, p.reviews,
      p.in_stock, p.featured, p.img, p.file, p.download_name, p.file_size, p.format,
      p.description, JSON.stringify(p.specs), JSON.stringify(p.variations)
    );
  });
}

// Seed Initial Sample Order if empty
const ordersCount = sqlite.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt;
if (ordersCount === 0) {
  sqlite.prepare(`
    INSERT INTO orders (
      order_id, customer_name, phone, email, company, address,
      items_summary, total, method, trx_id, sender_number, status, verified, created_at
    ) VALUES (
      'CAD-9842', 'Engr. Tanvir Ahmed', '01878205459', 'tanvir@engineers.com', 'Design Studio Architects',
      'House 12, Road 4, Dhanmondi, Dhaka', 'Master Architectural CAD Block Bundle (1,500+ Blocks)',
      899.00, 'bKash Send Money', '9J583KFA1', '01878205459', 'Pending Verification', 0, 'Today, 04:15 PM'
    )
  `).run();

  sqlite.prepare(`
    INSERT INTO order_items (
      order_id, product_id, product_title, variation, price, qty, file, download_name, file_size, format
    ) VALUES (
      'CAD-9842', 101, 'Master Architectural CAD Block Bundle (1,500+ Blocks)',
      'Professional Pack (750 Blocks)', 899.00, 1, 'cad-blocks-bundle.zip',
      'AutoCad-ConsumeR-Master-Blocks-1500.zip', '3.2 MB', '.DWG / .DXF / Dynamic Blocks'
    )
  `).run();
}

// DAO Methods
const db = {
  getSettings() {
    const rows = sqlite.prepare('SELECT key, value FROM settings').all();
    const result = {};
    rows.forEach(r => result[r.key] = r.value);
    return result;
  },

  updateSettings(data) {
    const stmt = sqlite.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) stmt.run(k, String(v));
    }
  },

  getProducts() {
    const rows = sqlite.prepare('SELECT * FROM products').all();
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      category: r.category,
      catName: r.cat_name,
      price: r.price,
      salePrice: r.sale_price,
      rating: r.rating,
      reviews: r.reviews,
      inStock: Boolean(r.in_stock),
      featured: Boolean(r.featured),
      img: r.img,
      file: r.file,
      downloadName: r.download_name,
      fileSize: r.file_size,
      format: r.format,
      desc: r.description,
      specs: JSON.parse(r.specs_json || '{}'),
      variations: JSON.parse(r.variations_json || '[]')
    }));
  },

  getProductById(id) {
    const r = sqlite.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      catName: r.cat_name,
      price: r.price,
      salePrice: r.sale_price,
      rating: r.rating,
      reviews: r.reviews,
      inStock: Boolean(r.in_stock),
      featured: Boolean(r.featured),
      img: r.img,
      file: r.file,
      downloadName: r.download_name,
      fileSize: r.file_size,
      format: r.format,
      desc: r.description,
      specs: JSON.parse(r.specs_json || '{}'),
      variations: JSON.parse(r.variations_json || '[]')
    };
  },

  getOrders() {
    const orders = sqlite.prepare('SELECT * FROM orders ORDER BY rowid DESC').all();
    const getItems = sqlite.prepare('SELECT * FROM order_items WHERE order_id = ?');

    return orders.map(o => ({
      orderId: o.order_id,
      customerName: o.customer_name,
      phone: o.phone,
      email: o.email,
      company: o.company,
      address: o.address,
      items: o.items_summary,
      total: o.total,
      method: o.method,
      trxId: o.trx_id,
      senderNumber: o.sender_number,
      status: o.status,
      verified: Boolean(o.verified),
      date: o.created_at,
      itemsList: getItems.all(o.order_id).map(i => ({
        id: i.product_id,
        title: i.product_title,
        variation: i.variation,
        price: i.price,
        qty: i.qty,
        file: i.file,
        downloadName: i.download_name,
        fileSize: i.file_size,
        format: i.format
      }))
    }));
  },

  getOrderById(orderId) {
    const o = sqlite.prepare('SELECT * FROM orders WHERE order_id = ?').get(orderId);
    if (!o) return null;
    const items = sqlite.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    return {
      orderId: o.order_id,
      customerName: o.customer_name,
      phone: o.phone,
      email: o.email,
      company: o.company,
      address: o.address,
      items: o.items_summary,
      total: o.total,
      method: o.method,
      trxId: o.trx_id,
      senderNumber: o.sender_number,
      status: o.status,
      verified: Boolean(o.verified),
      date: o.created_at,
      itemsList: items.map(i => ({
        id: i.product_id,
        title: i.product_title,
        variation: i.variation,
        price: i.price,
        qty: i.qty,
        file: i.file,
        downloadName: i.download_name,
        fileSize: i.file_size,
        format: i.format
      }))
    };
  },

  createOrder(data, cartItems) {
    const newOrderId = 'CAD-' + Math.floor(1000 + Math.random() * 9000);
    const total = cartItems.reduce((a, b) => a + (b.price * b.qty), 0);
    const itemsSummary = cartItems.map(c => c.title + ' (' + c.variation + ' x' + c.qty + ')').join(', ');
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: true, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const insertOrder = sqlite.prepare(`
      INSERT INTO orders (
        order_id, customer_name, phone, email, company, address,
        items_summary, total, method, trx_id, sender_number, status, verified, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      newOrderId, data.name, data.phone, data.email, data.company || '', data.address || '',
      itemsSummary, total, data.method, data.trxId, data.senderNumber,
      'Pending Verification', 0, dateStr
    );

    const insertItem = sqlite.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_title, variation, price, qty, file, download_name, file_size, format
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    cartItems.forEach(c => {
      const prod = this.getProductById(c.id);
      insertItem.run(
        newOrderId, c.id, c.title, c.variation, c.price, c.qty,
        prod ? prod.file : 'cad-blocks-bundle.zip',
        prod ? prod.downloadName : 'AutoCad-ConsumeR-Package.zip',
        prod ? prod.fileSize : '3.0 MB',
        prod ? prod.format : '.DWG / .DXF'
      );
    });

    return newOrderId;
  },

  verifyOrder(orderId) {
    sqlite.prepare("UPDATE orders SET verified = 1, status = 'Completed (Files Unlocked)' WHERE order_id = ?").run(orderId);
  },

  rejectOrder(orderId) {
    sqlite.prepare("UPDATE orders SET verified = 0, status = 'Rejected / On-Hold' WHERE order_id = ?").run(orderId);
  },

  addQuote(name, phone, email, service, scope, fileName) {
    const now = new Date().toISOString();
    sqlite.prepare(`
      INSERT INTO quotes (name, phone, email, service, scope, file_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, phone, email, service, scope, fileName || '', now);
  },

  getStats() {
    const totalOrders = sqlite.prepare('SELECT COUNT(*) as cnt FROM orders').get().cnt;
    const pendingOrders = sqlite.prepare('SELECT COUNT(*) as cnt FROM orders WHERE verified = 0').get().cnt;
    const verifiedRevenue = sqlite.prepare('SELECT SUM(total) as rev FROM orders WHERE verified = 1').get().rev || 0;
    const totalProducts = sqlite.prepare('SELECT COUNT(*) as cnt FROM products').get().cnt;
    const totalQuotes = sqlite.prepare('SELECT COUNT(*) as cnt FROM quotes').get().cnt;
    const dbStats = fs.statSync(DB_PATH);

    return {
      dbPath: DB_PATH,
      dbSize: (dbStats.size / 1024).toFixed(1) + ' KB',
      totalOrders,
      pendingOrders,
      verifiedRevenue,
      totalProducts,
      totalQuotes
    };
  },

  // Database Introspection for built-in phpMyAdmin replacement
  getTablesInfo() {
    const tables = ['products', 'orders', 'order_items', 'settings', 'quotes'];
    return tables.map(name => {
      const count = sqlite.prepare(`SELECT COUNT(*) as c FROM ${name}`).get().c;
      return { name, count };
    });
  },

  getTableData(tableName) {
    const safeName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    const columns = sqlite.prepare(`PRAGMA table_info(${safeName})`).all();
    const rows = sqlite.prepare(`SELECT * FROM ${safeName} LIMIT 100`).all();
    return { table: safeName, columns, rows };
  },

  deleteRow(tableName, pkCol, pkVal) {
    const safeTable = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    const safeCol = pkCol.replace(/[^a-zA-Z0-9_]/g, '');
    sqlite.prepare(`DELETE FROM ${safeTable} WHERE ${safeCol} = ?`).run(pkVal);
  },

  updateCell(tableName, pkCol, pkVal, colName, newVal) {
    const safeTable = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    const safePk = pkCol.replace(/[^a-zA-Z0-9_]/g, '');
    const safeCol = colName.replace(/[^a-zA-Z0-9_]/g, '');
    sqlite.prepare(`UPDATE ${safeTable} SET ${safeCol} = ? WHERE ${safePk} = ?`).run(newVal, pkVal);
  },

  insertRow(tableName, rowData) {
    const safeTable = tableName.replace(/[^a-zA-Z0-9_]/g, '');
    const keys = Object.keys(rowData).filter(k => /^[a-zA-Z0-9_]+$/.test(k));
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => rowData[k]);
    sqlite.prepare(`INSERT OR REPLACE INTO ${safeTable} (${keys.join(', ')}) VALUES (${placeholders})`).run(...values);
  },

  executeRawSql(sqlQuery) {
    const trimmed = sqlQuery.trim();
    if (trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('PRAGMA')) {
      return sqlite.prepare(trimmed).all();
    } else {
      sqlite.exec(trimmed);
      return { success: true, message: 'Executed query successfully.' };
    }
  },

  testSupabase(supabaseUrl, supabaseKey) {
    return new Promise((resolve) => {
      try {
        if (!supabaseUrl || !supabaseKey) {
          return resolve({ success: false, error: 'Supabase URL and API Key are required.' });
        }
        let cleanUrl = supabaseUrl.trim().replace(/\/+$/, '');
        if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
        const targetUrl = new URL(cleanUrl + '/rest/v1/products?select=id,title&limit=1');
        const req = https.request(targetUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey.trim(),
            'Authorization': 'Bearer ' + supabaseKey.trim()
          },
          timeout: 8000
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const parsed = JSON.parse(body);
                resolve({ success: true, message: 'Successfully connected to Supabase!', count: parsed.length, sample: parsed[0] });
              } catch (e) {
                resolve({ success: true, message: 'Successfully connected to Supabase Cloud!' });
              }
            } else {
              resolve({ success: false, statusCode: res.statusCode, error: body || `HTTP ${res.statusCode}` });
            }
          });
        });
        req.on('error', (err) => resolve({ success: false, error: err.message }));
        req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'Connection timed out. Check URL.' }); });
        req.end();
      } catch (err) {
        resolve({ success: false, error: err.message });
      }
    });
  }
};

module.exports = db;
