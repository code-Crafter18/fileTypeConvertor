const express = require('express');
const router = express.Router();
const { getHistory, deleteHistoryEntry } = require('../controllers/historyController');

// GET /api/history - Get all transformation history
router.get('/', getHistory);

// DELETE /api/history/:id - Delete a history entry
router.delete('/:id', deleteHistoryEntry);

module.exports = router;
