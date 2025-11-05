import { Router } from 'express';
import authenticateToken from '../../../middlewares/auth.js';
import db from '../../../config/db_config.js';

const router = Router();

// Route to get license history by license ID
router.get('/histroy/:id', authenticateToken, async (req, res) => {
  const license_id = req.params.id;
  const sql = `SELECT * FROM renewal_status_history WHERE license_id = ?`;

  try {
    const [result] = await db.query(sql, [license_id]);
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: 'Failed to fetch license history' });
    }
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error fetching license by ID:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to fetch license by ID.' });
  }
});
// Route to add a new license
router.post('/add_license', authenticateToken, async (req, res) => {
  const licenseSql = `
    INSERT INTO licenses 
    (description, license_number, linked_to, assigned_to, renewal_status, renewal_date, reminder, email, reminder_days) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const licenseValues = [
    req.body.description,
    req.body.license_number,
    req.body.linked_to || null,
    req.body.assigned_to || null,
    req.body.renewal_status || 'pending',
    req.body.renewal_date || null,
    req.body.reminder || null,
    req.body.email || null,
    req.body.reminder_days ? parseInt(req.body.reminder_days) : null,
  ];

  try {
    // Step 1: Insert the new license into the licenses table
    const [licenseResult] = await db.query(licenseSql, licenseValues);

    // Step 2: Get the newly inserted license ID
    const licenseId = licenseResult.insertId;

    // Step 3: Insert the status change into the history table
    const historySql = `
      INSERT INTO renewal_status_history (license_id, status, remarks)
      VALUES (?, ?, ?)
    `;

    const historyValues = [licenseId, req.body.renewal_status || 'pending', req.body.remarks || 'Initial status entry'];
    await db.query(historySql, historyValues);

    // Step 4: Send response indicating success
    res.json({ Status: true, Message: "License and status history added successfully" });
  } catch (err) {
    console.error('Error adding license:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to add license and history.', Details: err.message });
  }
});

// Route to update license status and add to history
router.put('/update_license/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { renewal_status, remarks } = req.body;

  const updateLicenseSql = `
    UPDATE licenses
    SET renewal_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  const insertHistorySql = `
    INSERT INTO renewal_status_history (license_id, status, remarks)
    VALUES (?, ?, ?)
  `;

  try {
    await db.query(updateLicenseSql, [renewal_status, id]);
    await db.query(insertHistorySql, [id, renewal_status, remarks]);

    res.json({ Status: true, Message: "License updated successfully with history entry" });
  } catch (err) {
    console.error('Error updating license:', err);
    res.status(500).json({ Status: false, Error: 'Failed to update license and history.', Details: err.message });
  }
});

// Route to get all licenses
router.get('/licenses', authenticateToken, async (req, res) => {
  const sql = 'SELECT * FROM licenses';
  try {
    const [result] = await db.query(sql);
    res.json({ Status: true, Result: result });
  } catch (err) {
    res.status(500).json({ Status: false, Error: err.message });
  }
});

// Route to get license by ID
router.get('/license/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM licenses WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: 'License not found.' });
    }
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error fetching license by ID:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to fetch license by ID.' });
  }
});

// Route to edit license details
router.put('/edit_license/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE licenses 
    SET description = ?, license_number = ?, linked_to = ?, renewal_status = ?, renewal_date = ?, reminder = ?
    WHERE id = ?
  `;
  const values = [
    req.body.description,
    req.body.license_number,
    req.body.linked_to,
    req.body.renewal_status,
    req.body.renewal_date,
    req.body.reminder
  ];

  try {
    const [result] = await db.query(sql, [...values, id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error updating license:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to update license.' });
  }
});

// Route to assign license
router.put('/assign_license/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE licenses 
    SET assigned_to = ? 
    WHERE id = ?
  `;
  try {
    const [result] = await db.query(sql, [req.body.assigned_to, id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error assigning license:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to assign license.' });
  }
});

// Route to delete license
router.delete('/delete_license/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM licenses WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error deleting license:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to delete license.' });
  }
});

export default router;
