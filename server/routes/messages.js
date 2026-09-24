const express = require('express');
const { runQuery, getQuery, allQuery } = require('../db');
const { requireAuth } = require('./auth');

const router = express.Router();

// Helper function to send Telegram notification
async function sendTelegramNotification(name, email, subject, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Telegram Bot] Token or Chat ID not configured in .env. Skipping Telegram message.');
    return;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const text = `📬 <b>Yangi Xabar! (Portfolio Contact)</b>\n\n` +
    `👤 <b>Ism:</b> ${escapeHtml(name)}\n` +
    `📧 <b>Email:</b> ${escapeHtml(email)}\n` +
    `📌 <b>Mavzu:</b> ${escapeHtml(subject || 'Mavzusiz')}\n\n` +
    `💬 <b>Xabar:</b>\n${escapeHtml(message)}\n\n` +
    `⏰ <b>Vaqt:</b> ${new Date().toLocaleString()}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    if (!result.ok) {
      console.warn('[Telegram Bot API Error]:', result.description);
    } else {
      console.log('[Telegram Bot] Message sent to chat', chatId);
    }
  } catch (err) {
    console.error('[Telegram Bot Network Error]:', err.message);
  }
}

// POST /api/contact - Public contact form submission
router.post(['/', '/contact'], async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const result = await runQuery(`
      INSERT INTO messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name.trim(), email.trim(), (subject || '').trim(), message.trim()]);

    // Send Telegram Notification asynchronously (doesn't block user response)
    sendTelegramNotification(name, email, subject, message).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent and saved successfully!',
      messageId: result.lastID
    });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    res.status(500).json({ error: 'Failed to submit contact message' });
  }
});

// GET /api/messages - List all messages (Admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await allQuery('SELECT * FROM messages ORDER BY createdAt DESC');
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/messages/:id/read - Mark message as read (Admin only)
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('UPDATE messages SET isRead = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    console.error('Error marking message read:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/messages/:id - Delete message (Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
