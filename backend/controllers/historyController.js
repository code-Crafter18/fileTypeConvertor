const Transformation = require('../models/Transformation');

/**
 * Get all transformation history
 * GET /api/history
 */
const getHistory = async (req, res) => {
  try {
    const history = await Transformation.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      count: history.length,
      history,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

/**
 * Delete a history entry
 * DELETE /api/history/:id
 */
const deleteHistoryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Transformation.findByIdAndDelete(id);

    if (!entry) {
      return res.status(404).json({ error: 'History entry not found' });
    }

    res.json({ message: 'History entry deleted', entry });
  } catch (error) {
    console.error('History delete error:', error);
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
};

module.exports = {
  getHistory,
  deleteHistoryEntry,
};
