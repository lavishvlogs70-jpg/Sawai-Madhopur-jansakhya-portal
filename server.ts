import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory / file backed store
const DATA_FILE = path.join(__dirname, 'census-data.json');

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), district: 'Sawai Madhopur' });
});

// Admin verify PIN
app.post('/api/admin/login', (req, res) => {
  const { pin, password } = req.body;
  if (pin === 'admin123' || pin === '7777' || password === 'admin123' || password === 'swm2026') {
    res.json({ success: true, token: 'admin-auth-token-swm-census-2026', role: 'SUPER_ADMIN' });
  } else {
    res.status(401).json({ success: false, message: 'अमान्य एडमिन पिन / पासवर्ड (Invalid Admin PIN)' });
  }
});

// Serve frontend static build in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Sawai Madhopur Census Portal Server running on http://localhost:${PORT}`);
});

export default app;
