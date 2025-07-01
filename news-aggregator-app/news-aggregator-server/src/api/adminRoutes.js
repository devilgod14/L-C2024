const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.use(isAuthenticated, isAdmin);

router.get('/sources', async (req, res) => {
  try {
    const sources = await adminService.getAllSources();
    res.json(sources);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/sources/:id', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ message: 'apiKey is required' });
  }
  try {
    const updatedSource = await adminService.updateSourceApiKey(req.params.id, apiKey);
    res.json(updatedSource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }
  try {
    const newCategory = await adminService.addCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/sources/:id', async (req, res) => {
  try {
    const source = await adminService.getSourceById(req.params.id);
    res.json(source);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const articles = await adminService.getReportedArticles();
    res.json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/articles/:id/hide', async (req, res) => {
  try {
    const article = await adminService.hideArticle(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/categories/:id/hide', async (req, res) => {
  try {
    const category = await adminService.hideCategory(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/categories/:id/unhide', async (req, res) => {
  try {
    const category = await adminService.unhideCategory(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/keywords', async (req, res) => {
  try {
    const keywords = await adminService.getBlockedKeywords();
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/keywords', async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }
  try {
    const newKeyword = await adminService.addBlockedKeyword({ keyword, adminId: req.user.id });
    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/keywords/:id', async (req, res) => {
    try {
        await adminService.removeBlockedKeyword(req.params.id);
        res.json({ message: 'Keyword removed successfully.' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;