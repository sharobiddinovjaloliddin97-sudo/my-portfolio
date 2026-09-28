const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_portfolio_jwt_key_2026';
const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

// Middleware to protect admin routes
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// In-memory rate limiting for login attempts (max 5 failed attempts per 5 minutes per IP)
const loginAttempts = new Map();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 5 * 60 * 1000;
  const maxAttempts = 5;

  const records = (loginAttempts.get(ip) || []).filter(ts => now - ts < windowMs);
  if (records.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 5 minutes.'
    });
  }

  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ error: 'PIN is required' });
  }

  if (String(pin).trim() === String(ADMIN_PIN).trim()) {
    loginAttempts.delete(ip); // Clear on success
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token,
      message: 'Access granted'
    });
  } else {
    records.push(now);
    loginAttempts.set(ip, records);
    return res.status(401).json({
      success: false,
      error: 'Incorrect PIN. Access denied.'
    });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

module.exports = {
  router,
  requireAuth
};
