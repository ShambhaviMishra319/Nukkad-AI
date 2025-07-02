const pool = require('./db');

exports.getOrCreateItemId = async (itemName) => {
  const client = await pool.connect();
  try {
    const check = await client.query('SELECT id FROM items WHERE name = $1', [itemName]);

    if (check.rows.length > 0) return check.rows[0].id;

    const insert = await client.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING id',
      [itemName]
    );
    return insert.rows[0].id;
  } finally {
    client.release();
  }
};

exports.insertSale = async (vendorId, itemId, quantity) => {
  await pool.query(
    'INSERT INTO sales_logs (vendor_id, item_id, quantity) VALUES ($1, $2, $3)',
    [vendorId, itemId, quantity]
  );
};
