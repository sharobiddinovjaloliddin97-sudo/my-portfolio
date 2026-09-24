const express = require('express');
const { runQuery, getQuery, allQuery } = require('../db');
const { requireAuth } = require('./auth');

const router = express.Router();

// GET /api/profile - return full profile + categories + skills + experience
router.get('/', async (req, res) => {
  try {
    const profileRow = await getQuery('SELECT * FROM profile WHERE id = 1');
    const categoriesRows = await allQuery('SELECT * FROM categories');
    const skillsRows = await allQuery('SELECT * FROM skills');
    const experienceRows = await allQuery('SELECT * FROM experience');

    const profile = profileRow ? {
      ...profileRow,
      socialLinks: typeof profileRow.socialLinks === 'string' ? JSON.parse(profileRow.socialLinks || '{}') : profileRow.socialLinks,
      stats: typeof profileRow.stats === 'string' ? JSON.parse(profileRow.stats || '[]') : profileRow.stats
    } : null;

    const skills = skillsRows.map(s => ({
      ...s,
      items: typeof s.items === 'string' ? JSON.parse(s.items || '[]') : s.items
    }));

    res.json({
      profile,
      categories: categoriesRows,
      skills,
      experience: experienceRows
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - update profile (Admin only)
router.put('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      title,
      statusBadge,
      bio,
      location,
      email,
      phone,
      socialLinks,
      stats
    } = req.body;

    const stringifiedSocialLinks = JSON.stringify(socialLinks || {});
    const stringifiedStats = stats ? JSON.stringify(stats) : undefined;

    const existing = await getQuery('SELECT * FROM profile WHERE id = 1');
    if (!existing) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await runQuery(`
      UPDATE profile SET
        name = ?,
        title = ?,
        statusBadge = ?,
        bio = ?,
        location = ?,
        email = ?,
        phone = ?,
        socialLinks = ?,
        stats = COALESCE(?, stats),
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      name || existing.name,
      title || existing.title,
      statusBadge !== undefined ? statusBadge : existing.statusBadge,
      bio !== undefined ? bio : existing.bio,
      location !== undefined ? location : existing.location,
      email || existing.email,
      phone !== undefined ? phone : existing.phone,
      stringifiedSocialLinks,
      stringifiedStats
    ]);

    const updated = await getQuery('SELECT * FROM profile WHERE id = 1');
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...updated,
        socialLinks: JSON.parse(updated.socialLinks || '{}'),
        stats: JSON.parse(updated.stats || '[]')
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
