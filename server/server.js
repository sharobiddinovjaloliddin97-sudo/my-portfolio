require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, getQuery } = require('./db');

const { router: authRouter } = require('./routes/auth');
const projectsRouter = require('./routes/projects');
const profileRouter = require('./routes/profile');
const messagesRouter = require('./routes/messages');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
const rootDir = path.join(__dirname, '..');
const DATA_DIR = process.env.DATA_DIR || rootDir;
app.use(express.static(rootDir));
app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')));
app.use('/assets', express.static(path.join(rootDir, 'assets')));
app.use('/css', express.static(path.join(rootDir, 'css')));
app.use('/js', express.static(path.join(rootDir, 'js')));

// Serve main HTML pages
app.get(['/', '/index', '/index.html'], (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(rootDir, 'admin.html'));
});

// Quick Stats Endpoint for Dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const projCount = await getQuery('SELECT COUNT(*) as count FROM projects');
    const msgCount = await getQuery('SELECT COUNT(*) as total, SUM(CASE WHEN isRead = 0 THEN 1 ELSE 0 END) as unread FROM messages');
    const viewsCount = await getQuery('SELECT SUM(views) as totalViews FROM projects');

    res.json({
      totalProjects: projCount.count || 0,
      totalMessages: msgCount.total || 0,
      unreadMessages: msgCount.unread || 0,
      totalViews: viewsCount.totalViews || 0
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/contact', messagesRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/upload', uploadRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server & Init Database
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
      console.log(`📊 Admin Panel at http://localhost:${PORT}/admin.html`);
      console.log(`📡 REST API active on http://localhost:${PORT}/api/`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
