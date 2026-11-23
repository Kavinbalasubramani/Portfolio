require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { connectDB } = require('./config/db');
const { syncModels } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ── Route imports ──────────────────────────────────────────────────────────────
const authRoutes       = require('./routes/authRoutes');
const profileRoutes    = require('./routes/profileRoutes');
const skillRoutes      = require('./routes/skillRoutes');
const projectRoutes    = require('./routes/projectRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const educationRoutes  = require('./routes/educationRoutes');
const serviceRoutes    = require('./routes/serviceRoutes');
const messageRoutes    = require('./routes/messageRoutes');
const publicContactRoutes = require('./routes/publicContactRoutes');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder with permissive CORS headers for client-side processing
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Kavin B Portfolio API is running 🚀', timestamp: new Date().toISOString() });
});

app.get('/api/cv', (_req, res) => {
  const cvPath = path.join(__dirname, 'storage', 'Kavin_B_CV.pdf');
  if (!fs.existsSync(cvPath)) {
    return res.status(404).json({ success: false, message: 'CV is not available yet.' });
  }
  return res.download(cvPath, 'Kavin_B_CV.pdf');
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/profile',    profileRoutes);
app.use('/api/skills',     skillRoutes);
app.use('/api/projects',   projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education',  educationRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/messages',   messageRoutes);
app.use('/api/contact',    publicContactRoutes);

// ── 404 + Error handlers ───────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Bootstrap ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Connect to MySQL (creates DB if missing)
    await connectDB();
    
    await syncModels();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API health: http://localhost:${PORT}/api/health`);
      console.log(`🔑 Admin login → POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   Email:    ${process.env.ADMIN_EMAIL || 'admin@kavin.dev'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
