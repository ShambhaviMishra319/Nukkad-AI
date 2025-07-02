const aiService = require('../services/aiService');
const salesModel = require('../models/salesModel');

exports.logSale = async (req, res) => {
  const { vendor_id, text } = req.body;

  try {
    const parsedItems = await aiService.parseSalesText(text);

    for (const entry of parsedItems) {
      const itemName = entry.item;
      const quantity = entry.quantity;

      const itemId = await salesModel.getOrCreateItemId(itemName);
      await salesModel.insertSale(vendor_id, itemId, quantity);
    }

    res.status(200).json({ message: 'Sales log saved successfully!' });
  } catch (error) {
    console.error('logSale error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
