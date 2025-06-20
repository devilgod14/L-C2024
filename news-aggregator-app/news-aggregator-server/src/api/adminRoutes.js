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

module.exports = router;