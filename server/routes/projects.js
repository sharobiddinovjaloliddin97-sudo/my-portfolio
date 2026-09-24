const express = require('express');
const { runQuery, getQuery, allQuery } = require('../db');
const { requireAuth } = require('./auth');

const router = express.Router();

function parseProject(row) {
  if (!row) return null;
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
    features: typeof row.features === 'string' ? JSON.parse(row.features || '[]') : (row.features || [])
  };
}

// GET /api/projects - list all projects
router.get('/', async (req, res) => {
  try {
    const rows = await allQuery('SELECT * FROM projects ORDER BY createdAt DESC');
    const projects = rows.map(parseProject);
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - single project with view increment
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getQuery('SELECT * FROM projects WHERE id = ?', [id]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment view count
    await runQuery('UPDATE projects SET views = views + 1 WHERE id = ?', [id]);
    project.views += 1;

    res.json(parseProject(project));
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - add new project (Admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      image,
      metric,
      tags,
      overview,
      problem,
      solution,
      features,
      demoUrl,
      githubUrl
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
    const stringifiedTags = JSON.stringify(Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []));
    const stringifiedFeatures = JSON.stringify(Array.isArray(features) ? features : (features ? features.split('\n').map(f => f.trim()).filter(Boolean) : []));

    await runQuery(`
      INSERT INTO projects (id, title, subtitle, category, image, metric, tags, overview, problem, solution, features, demoUrl, githubUrl, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [
      id,
      title,
      subtitle || '',
      category || 'fullstack',
      image || 'assets/project-ai.jpg',
      metric || '',
      stringifiedTags,
      overview || '',
      problem || '',
      solution || '',
      stringifiedFeatures,
      demoUrl || '#',
      githubUrl || '#'
    ]);

    const created = await getQuery('SELECT * FROM projects WHERE id = ?', [id]);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: parseProject(created)
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project: ' + err.message });
  }
});

// PUT /api/projects/:id - update project (Admin only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getQuery('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const {
      title,
      subtitle,
      category,
      image,
      metric,
      tags,
      overview,
      problem,
      solution,
      features,
      demoUrl,
      githubUrl
    } = req.body;

    const stringifiedTags = JSON.stringify(Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []));
    const stringifiedFeatures = JSON.stringify(Array.isArray(features) ? features : (features ? features.split('\n').map(f => f.trim()).filter(Boolean) : []));

    await runQuery(`
      UPDATE projects SET
        title = ?,
        subtitle = ?,
        category = ?,
        image = ?,
        metric = ?,
        tags = ?,
        overview = ?,
        problem = ?,
        solution = ?,
        features = ?,
        demoUrl = ?,
        githubUrl = ?
      WHERE id = ?
    `, [
      title || existing.title,
      subtitle !== undefined ? subtitle : existing.subtitle,
      category || existing.category,
      image || existing.image,
      metric !== undefined ? metric : existing.metric,
      stringifiedTags,
      overview !== undefined ? overview : existing.overview,
      problem !== undefined ? problem : existing.problem,
      solution !== undefined ? solution : existing.solution,
      stringifiedFeatures,
      demoUrl !== undefined ? demoUrl : existing.demoUrl,
      githubUrl !== undefined ? githubUrl : existing.githubUrl,
      id
    ]);

    const updated = await getQuery('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Project updated successfully',
      project: parseProject(updated)
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - delete project (Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await getQuery('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await runQuery('DELETE FROM projects WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Project ${existing.title} deleted successfully`
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
