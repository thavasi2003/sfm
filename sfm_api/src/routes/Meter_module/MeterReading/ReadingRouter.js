import { Router } from 'express';
import db from "../../../config/db_config.js";
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

// Add-Reading
router.post('/add_readings', authenticateToken, async (req, res) => {
    const sql = `INSERT INTO mreading
    (meter_name, meter_reading, meter_unit, update_on, update_by, image, meter_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.meter_name,
        req.body.meter_reading,
        req.body.meter_unit,
        req.body.update_on,
        req.body.update_by,
        req.body.image,
        req.body.meter_id
    ];

    try {
        const [result] = await db.query(sql, values);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

// Fetch meter reading by ID
router.get('/meter_reading/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM meter WHERE id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

// Fetch readings by meter ID
router.get('/readings/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM mreading WHERE meter_id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

// Edit reading by ID
router.get('/reading/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM mreading WHERE reading_id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

router.put('/edit_reading/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE mreading 
        SET meter_reading = ?, update_on = ?, update_by = ? 
        WHERE reading_id = ?`;
    const values = [
        req.body.meter_reading,
        req.body.update_on,
        req.body.update_by
    ];

    try {
        const [result] = await db.query(sql, [...values, id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

// Delete reading by ID
router.delete('/delete_reading/:reading_id', authenticateToken, async (req, res) => {
    const id = req.params.reading_id;
    const sql = "DELETE FROM mreading WHERE reading_id = ?";

    try {
        const [result] = await db.query(sql, [id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

export default router;
