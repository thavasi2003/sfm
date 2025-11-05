import { Router } from "express";
import db from "../../../config/db_config.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = Router();
  
  // Add Meter
  router.post('/add_meter', authenticateToken, async (req, res) => {
  
    const sql = `INSERT INTO meter 
      (meter_name, meter_unit, zone, school, warranty_till, install_on, asset_id, asset_location, block, level, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    const values = [
      req.body.meter_name,
      req.body.meter_unit,
      req.body.zone,
      req.body.school,
      req.body.warranty_till,
      req.body.install_on,
      req.body.asset_id,
      req.body.asset_location,
      req.body.block,
      req.body.level,
      req.body.image
    ];
  
    try {
      const [result] = await db.query(sql, values);
      res.json({ Status: true, Result: result });
    } catch (err) {
      res.status(500).json({ Status: false, Error: err.message });
    }
  });
  

// Get all meters
router.get('/meter', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM meter";

    try {
        const [result] = await db.query(sql);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Get meter by ID
router.get('/meter/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM meter WHERE id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Edit meter
router.put('/edit_meter/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE meter 
        SET meter_name = ?, meter_unit = ?, zone = ?, school = ?, install_on = ?, warranty_till = ?, asset_id = ?, asset_location = ?, block = ?, level = ?
        WHERE id = ?`;
    const values = [
        req.body.meter_name,
        req.body.meter_unit,
        req.body.zone,
        req.body.school,
        req.body.install_on,
        req.body.warranty_till,
        req.body.asset_id,
        req.body.asset_location,
        req.body.block,
        req.body.level,
    ];

    try {
        const [result] = await db.query(sql, [...values, id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Delete meter
router.delete('/delete_meter/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM meter WHERE id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

export default router;
