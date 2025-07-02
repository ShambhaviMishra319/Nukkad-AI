const axios = require('axios');

exports.parseSalesText = async (text) => {
  try {
    const res = await axios.post('http://localhost:5001/parse-log', { text });
    return res.data.parsed_items;
  } catch (err) {
    console.error('AI service error:', err.message);
    throw new Error('Failed to parse sales text');
  }
};
