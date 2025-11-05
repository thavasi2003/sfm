import { Router } from 'express';
import db from '../../../config/db_config.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

// Add Report Fault
router.post('/add_request', authenticateToken, async (req, res) => {
    const sql = `INSERT INTO fault_report 
    (fault_type, priority, zone, school, block, level, room_number, room_name, droup_down, requestor_name, requestor_contact, description, image, created_at,report_said) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Get the current date
    const created_at = new Date().toISOString().slice(0, 10);

    let images;
    if (Array.isArray(req.body.images)) {
        images = JSON.stringify(req.body.images); // Store the JSON string of images
    }
    const values = [
        req.body.fault_type,
        req.body.priority,
        req.body.zone,
        req.body.school,
        req.body.block,
        req.body.level,
        req.body.room_number,
        req.body.room_name,
        req.body.droup_down,
        req.body.requestor_name,
        req.body.requestor_contact,
        req.body.description,
        images,  // Store the JSON string of images
        created_at,
        req.body.report_said,
    ];        
    try {
        await db.query(sql, values);
        res.json({ Status: true });
    } catch (err) {
        console.error("Error inserting fault report:", err.message); 
        res.json({ Status: false, Error: err.message });
    }
});

// Get all reports
router.get('/report', authenticateToken, async (req, res) => {
    const sql = 'SELECT * FROM fault_report ORDER BY id DESC';
    try {
        const [results] = await db.query(sql);
        res.status(200).json({ Status: true, data: results });
    } catch (err) {
        res.status(500).json({ Status: false, Error: 'Error fetching data' });
    }
});

//   Edit Report Fault
router.get('/report/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM fault_report WHERE id = ?";
    try {
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});


// Update report
router.put('/request/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE fault_report
    SET 
        fault_type = ?, 
        priority = ?, 
        zone = ?, 
        school = ?, 
        block = ?, 
        level = ?, 
        room_number = ?, 
        room_name = ?, 
        droup_down = ?, 
        requestor_name = ?, 
        requestor_contact = ?
    WHERE id = ?`;
    const values = [
        req.body.fault_type,
        req.body.priority,
        req.body.zone,
        req.body.school,
        req.body.block,
        req.body.level,
        req.body.room_number,
        req.body.room_name,
        req.body.droup_down,
        req.body.requestor_name,
        req.body.requestor_contact,
    ];
    try {
        await db.query(sql, [...values, id]);
        res.json({ Status: true });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// Delete report
router.delete('/delete_request/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM fault_report WHERE id = ?";
    try {
        await db.query(sql, [id]);
        res.json({ Status: true });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

export default router;
