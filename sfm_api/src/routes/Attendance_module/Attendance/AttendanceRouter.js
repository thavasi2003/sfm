import { Router } from 'express';
import db from '../../../config/db_config.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();


// Add Attendance
router.post('/add_attendance', authenticateToken, async (req, res) => {
  const sql = `INSERT INTO attendance 
               (zone, school, tech_name, date, checkin, checkout, image) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    req.body.zone,
    req.body.school,
    req.body.tech_name,
    req.body.date,
    req.body.checkin,
    req.body.checkout,
    req.body.image
  ];

  try {
    const [result] = await db.query(sql, values);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error adding attendance:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to add attendance.' });
  }
});

// Get Attendance
router.get('/attendance', authenticateToken, async (req, res) => {
  const sql = 'SELECT * FROM attendance';

  try {
    const [results] = await db.query(sql);
    res.status(200).json({ Status: true, Data: results });
  } catch (err) {
    console.error('Error fetching attendance:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to fetch attendance.' });
  }
});

// Get Attendance by ID
router.get('/attendance/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM attendance WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: 'Attendance not found.' });
    }
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error fetching attendance by ID:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to fetch attendance by ID.' });
  }
});

// Edit Attendance
router.put('/edit_attendance/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE attendance 
               SET zone = ?, school = ?, tech_name = ?, date = ?, checkin = ?, checkout = ? 
               WHERE id = ?`;
  const values = [
    req.body.zone,
    req.body.school,
    req.body.tech_name,
    req.body.date,
    req.body.checkin,
    req.body.checkout,
  ];

  try {
    const [result] = await db.query(sql, [...values, id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error updating attendance:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to update attendance.' });
  }
});

// Delete Attendance
router.delete('/delete_attendance/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM attendance WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error('Error deleting attendance:', err.message);
    res.status(500).json({ Status: false, Error: 'Failed to delete attendance.' });
  }
});

export default router;
