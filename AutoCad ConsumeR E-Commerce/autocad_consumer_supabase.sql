-- ==============================================================================
-- AutoCad ConsumeR — Official Supabase (PostgreSQL) Database Setup Script
-- Platform: Supabase (https://supabase.com)
-- Dialect: PostgreSQL 14+ / 15+ / 16+
-- Brand: AutoCad ConsumeR
-- Official Helpline & Gateway Number: 01878205459 (bKash, Nagad, Rocket, WhatsApp)
-- Currency: BDT (৳)
-- ==============================================================================

-- 1. CLEANUP PREVIOUS TABLES (IF ANY)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;

-- 2. CREATE SCHEMAS & TABLES

-- Table: settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Table: categories
CREATE TABLE categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  item_count INTEGER DEFAULT 0
);

-- Table: products
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  cat_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  img TEXT NOT NULL,
  file TEXT NOT NULL,
  download_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  format TEXT NOT NULL,
  description TEXT NOT NULL,
  specs_json JSONB,
  variations_json JSONB
);

-- Table: orders
CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  address TEXT,
  items_summary TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL,
  trx_id TEXT NOT NULL,
  sender_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Verification',
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_title TEXT NOT NULL,
  variation TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL,
  file TEXT NOT NULL,
  download_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  format TEXT NOT NULL
);

-- Table: quotes
CREATE TABLE quotes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  scope TEXT NOT NULL,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated/service settings" ON settings FOR ALL USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert quotes" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read quotes" ON quotes FOR SELECT USING (true);

-- 4. INSERT DEFAULT SETTINGS
INSERT INTO settings (key, value) VALUES
  ('brandName', 'AutoCad ConsumeR'),
  ('phone', '+880 1878-205459'),
  ('whatsapp', '01878205459'),
  ('email', 'support@autocadconsumer.com'),
  ('address', 'Engineering Tower, Level 4, Panthapath, Dhaka-1205, Bangladesh'),
  ('bkashNo', '01878205459'),
  ('nagadNo', '01878205459'),
  ('rocketNo', '01878205459');

-- 5. INSERT CATEGORIES
INSERT INTO categories (slug, name, description, item_count) VALUES
  ('cad-blocks', 'CAD Blocks & Symbols', '1,500+ Furniture, electrical, plumbing, sanitary, and mechanical 2D blocks.', 45),
  ('templates', 'DWG/DXF Templates', 'Standardized drawing sheets, title blocks (A0 to A4), and CTB plot styles.', 18),
  ('architectural', 'Architectural Drafting', 'Full residential & commercial drawings: floor plans, elevations, sections.', 32),
  ('structural', 'Structural Drawing Resources', 'RC column/beam rebar details, foundation layouts, and steel connections.', 24),
  ('boq-tools', 'BOQ & Estimation Tools', 'Dynamic Excel spreadsheets with automated rate analysis for Bangladesh.', 12),
  ('services', 'Custom CAD Design Services', 'Turnkey 2D drafting, PDF-to-CAD conversion, redline cleanups, and plotting.', 6);

-- 6. INSERT CAD PRODUCTS
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (101, 'Master Architectural CAD Block Bundle (1,500+ Blocks)', 'cad-blocks', 'CAD Blocks & Symbols', 1200, 899, 4.9, 38, TRUE, TRUE, '/theme/assets/images/placeholders/cad-blocks.svg', 'cad-blocks-bundle.zip', 'AutoCad-ConsumeR-Master-Blocks-1500.zip', '3.2 MB', '.DWG / .DXF / Dynamic Blocks', 'Extensive 2D collection: living room furniture, commercial sanitary fixtures, kitchen modules, landscaping, electrical symbols, dynamic doors & windows.', '{"format":".DWG (AutoCAD 2007–2025) + .DXF","scale":"1:1 Metric (mm) & Imperial","layers":"AIA Standard Color-Coded Layers","blocks":"1,500+ Dynamic & Static CAD Blocks","delivery":"Instant ZIP Archive Download (3.2 MB)"}'::jsonb, '[{"name":"Starter Pack (250 Basic Blocks)","price":499},{"name":"Professional Pack (750 Blocks)","price":899,"default":true},{"name":"Master Bureau Suite (1,500+ Blocks + Commercial License)","price":1450}]'::jsonb);
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (102, 'Standard DWG/DXF Title Block & Sheet Templates (A0 to A4)', 'templates', 'DWG/DXF Templates', 650, 499, 5, 24, TRUE, TRUE, '/theme/assets/images/placeholders/dwg-template.svg', 'dwg-sheet-templates.zip', 'AutoCad-ConsumeR-Title-Sheets-A0-A4.zip', '2.6 MB', '.DWG / .DXF / CTB Plot Styles', 'Standardized drawing sheets compliant with ISO and ANSI specifications. Includes dynamic viewports and calibrated monochrome CTB plot files.', '{"format":".DWG, .DXF, .DWT Template File","scale":"A0, A1, A2, A3, A4 Sheet Sizes","layers":"ISO Standard Drawing Borders & Title Fields","blocks":"Dynamic Revision & Approval Stamps","delivery":"Instant ZIP with CTB Pen Plot Styles (2.6 MB)"}'::jsonb, '[{"name":"Single Sheet Template (A3/A4)","price":299},{"name":"Full ISO Metric Suite (A0-A4 + CTB Styles)","price":499,"default":true},{"name":"Corporate Enterprise Kit (Metric + Imperial + Font Pack)","price":850}]'::jsonb);
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (103, 'Residential Villa Multi-Story Architectural Drawing Set', 'architectural', 'Architectural Drafting', 2500, 1850, 4.8, 19, TRUE, TRUE, '/theme/assets/images/placeholders/architectural-plans.svg', 'architectural-villa-plans.zip', 'AutoCad-ConsumeR-Duplex-Villa-Architectural-Set.zip', '2.5 MB', '.DWG / .DXF / Vector PDF Sheets', 'Complete residential design: ground & typical floor plans, 4-side elevations, sectional details, staircase layouts, and roof drainage details.', '{"format":".DWG + Layered Vector PDF Sheets","scale":"1:100 Metric Architectural Scale","layers":"Structured Wall, Opening, Furniture, Text Layers","sheets":"12 Full Presentation & Working Drawing Sheets","delivery":"Instant Download ZIP (2.5 MB)"}'::jsonb, '[{"name":"Floor Plans Only (Ground + First)","price":950},{"name":"Complete 12-Sheet Architectural Set","price":1850,"default":true},{"name":"Architectural + Structural Framing Bundle","price":2800}]'::jsonb);
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (104, 'Reinforced Concrete Structural Detailing DWG Library', 'structural', 'Structural Drawing Resources', 1800, 1350, 4.9, 42, TRUE, TRUE, '/theme/assets/images/placeholders/structural-steel.svg', 'structural-rebar-library.zip', 'AutoCad-ConsumeR-RC-Structural-Rebar-Library.zip', '2.0 MB', '.DWG / .DXF / BNBC & ACI Details', 'Rebar detailing standards: column schedules, continuous beam cross-sections, isolated footings, shear walls, and steel gusset connections.', '{"format":".DWG (BNBC & ACI 318 Standard Details)","scale":"1:20 & 1:50 Detailing Scale","layers":"Rebar, Stirrup, Concrete, Dimension Layers","elements":"Footings, Columns, Beams, Slabs, Retaining Walls","delivery":"Instant ZIP Download (2.0 MB)"}'::jsonb, '[{"name":"Foundation & Footing Details Pack","price":650},{"name":"Complete Rebar Detailing Library (All Elements)","price":1350,"default":true},{"name":"Structural Detailing + Excel BBS Bar Bending Tool","price":1950}]'::jsonb);
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (105, 'Building Construction BOQ & Rate Analysis Estimator', 'boq-tools', 'BOQ & Estimation Tools', 950, 750, 4.7, 15, TRUE, FALSE, '/theme/assets/images/placeholders/boq-estimator.svg', 'boq-rate-analysis-bangladesh.zip', 'AutoCad-ConsumeR-BOQ-Estimator-PWD-LGED.zip', '1.2 MB', '.CSV / .XLSX / Formulas Included', 'Automated Excel sheet with linked formulas, material quantity takeoffs, and rate analysis according to Bangladesh PWD/LGED schedules.', '{"format":".XLSX Automated Matrix Spreadsheet + .DWG Takeoff Guide","scale":"Pre-formatted for Bangladeshi Building Projects","features":"Dynamic Material Takeoff, Labor Rates, Equipment Costs","standards":"PWD / LGED Schedule of Rates Compatible","delivery":"Instant Spreadsheet & Documentation (1.2 MB)"}'::jsonb, '[{"name":"Residential BOQ Template Only","price":450},{"name":"Complete Master BOQ & Rate Analysis Tool","price":750,"default":true},{"name":"Master BOQ + Material Specification Handbook","price":1100}]'::jsonb);
INSERT INTO products (id, title, category, cat_name, price, sale_price, rating, reviews, in_stock, featured, img, file, download_name, file_size, format, description, specs_json, variations_json) VALUES (106, '2D CAD Drafting & PDF-to-CAD Conversion Service (Per Sheet)', 'services', 'Custom CAD Design Services', 1800, 1500, 5, 57, TRUE, FALSE, '/theme/assets/images/placeholders/drafting-service.svg', 'cad-drafting-service-brief.zip', 'AutoCad-ConsumeR-Drafting-Service-Brief.zip', '930 KB', '.DWG / .DXF / Service Brief & Instructions', 'Order professional 2D drafting for your architectural or structural sheet. Includes up to 2 revisions and delivery in both native .DWG and vector .PDF.', '{"format":"Custom Native .DWG + Print-ready .PDF + CTB","scale":"Custom Architectural / Engineering Scale","turnaround":"24 to 48 Hours Standard Delivery","revisions":"2 Free Iterative Revisions Included","delivery":"Digital Transfer via Download Link"}'::jsonb, '[{"name":"Simple Drawing / Conversion (1 Sheet)","price":800},{"name":"Standard Working Drawing Sheet (1 Sheet)","price":1500,"default":true},{"name":"Complex Detailing / Large Format A0 Sheet","price":2500}]'::jsonb);

-- 7. SETUP CONFIRMATION
SELECT 'AutoCad ConsumeR tables and seed data created successfully in Supabase!' AS message;
