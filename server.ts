import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('insurance.db');

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Individual' | 'Family'
    coverage_limit REAL NOT NULL,
    premium_amount REAL NOT NULL,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS policies (
    id TEXT PRIMARY KEY,
    product_id INTEGER,
    holder_name TEXT NOT NULL,
    holder_email TEXT NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATETIME NOT NULL,
    status TEXT DEFAULT 'Active', -- 'Active' | 'Expired' | 'Pending Renewal'
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    policy_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    document_path TEXT,
    status TEXT DEFAULT 'Submitted', -- 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Settled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(id)
  );
`);

// Seed initial products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, type, coverage_limit, premium_amount) VALUES (?, ?, ?, ?)');
  insert.run('Basic Health', 'Individual', 500000, 5000);
  insert.run('Family Secure', 'Family', 1500000, 12000);
  insert.run('Premium Care', 'Individual', 2500000, 25000);
}

const app = express();
app.use(express.json());

// File Upload Setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// API Routes
// Products (Admin)
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, type, coverage_limit, premium_amount } = req.body;
  const info = db.prepare('INSERT INTO products (name, type, coverage_limit, premium_amount) VALUES (?, ?, ?, ?)').run(name, type, coverage_limit, premium_amount);
  res.json({ id: info.lastInsertRowid });
});

app.patch('/api/products/:id', (req, res) => {
  const { is_active } = req.body;
  db.prepare('UPDATE products SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, req.params.id);
  res.json({ success: true });
});

// Policies (Customer)
app.post('/api/purchase', (req, res) => {
  const { product_id, holder_name, holder_email } = req.body;
  const policyId = 'POL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  db.prepare('INSERT INTO policies (id, product_id, holder_name, holder_email, expiry_date) VALUES (?, ?, ?, ?, ?)').run(
    policyId, product_id, holder_name, holder_email, expiryDate.toISOString()
  );

  res.json({ policyId, expiryDate });
});

app.get('/api/my-policies', (req, res) => {
  const email = req.query.email as string;
  const policies = db.prepare(`
    SELECT p.*, pr.name as product_name, pr.coverage_limit 
    FROM policies p 
    JOIN products pr ON p.product_id = pr.id 
    WHERE p.holder_email = ?
  `).all(email);
  res.json(policies);
});

// Claims
app.post('/api/claims', upload.single('document'), (req, res) => {
  const { policy_id, amount, description } = req.body;
  const document_path = req.file ? req.file.path : null;

  const info = db.prepare('INSERT INTO claims (policy_id, amount, description, document_path) VALUES (?, ?, ?, ?)').run(
    policy_id, amount, description, document_path
  );

  res.json({ id: info.lastInsertRowid });
});

app.get('/api/claims/:policyId', (req, res) => {
  const claims = db.prepare('SELECT * FROM claims WHERE policy_id = ?').all(req.params.policyId);
  res.json(claims);
});

// Admin Claims View
app.get('/api/admin/claims', (req, res) => {
  const claims = db.prepare(`
    SELECT c.*, p.holder_name 
    FROM claims c 
    JOIN policies p ON c.policy_id = p.id
  `).all();
  res.json(claims);
});

app.patch('/api/claims/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE claims SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Vite setup
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
