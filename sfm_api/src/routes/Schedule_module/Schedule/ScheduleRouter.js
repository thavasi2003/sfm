import { Router } from 'express';
import db from '../../../config/db_config.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

// Add Maintenance Route with corrected table name
router.post('/add_schedule', authenticateToken, async (req, res) => {
    const { zone, schoolName, team, maintenanceType, priority, startDate, endDate, remarks } = req.body;

    const sql = `INSERT INTO maintenance 
        (zone, schoolName, team, maintenanceType, priority, dateStart, dateEnd, remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        zone,
        schoolName,
        team,
        maintenanceType ,
        priority,
        startDate,  
        endDate,    
        remarks || null,  
    ];

    try {
        await db.query(sql, values);
        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, Error: err.message });
    }
});
// Edit Maintenance
router.get('/get_schedule/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM maintenance WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error" });
    }
});


router.get('/get_schedule', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM maintenance";
    try {
        const [result] = await db.query(sql);
        
        // Check if result is an array and send it in the expected format
        if (Array.isArray(result)) {
            return res.json({ Status: true, data: result });  // Using data instead of Result
        } else {
            return res.json({ Status: false, Error: "No data found" });
        }
    } catch (err) {
        return res.json({ Status: false, Error: "Query Error: " + err });
    }
});

router.put('/edit_schedule/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const sql = ` 
        UPDATE maintenance 
        SET 
            zone = ?, schoolName = ?, team = ?, maintenanceType = ?, priority = ?, dateStart = ?, 
            dateEnd = ?,reschedulestart = ?,rescheduleend = ?, remarks = ? 
        WHERE id = ?`;

    const values = [
        req.body.zone,            
        req.body.schoolName,      
        req.body.team,            
        req.body.maintenanceType, 
        req.body.priority,        
        req.body.dateStart ,       
        req.body.dateEnd, 
        req.body.reschedulestart,
        req.body.rescheduleend,        
        req.body.remarks || null, 
    ];

    try {
        const [result] = await db.query(sql, [...values, id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Query Error:', err);
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// Delete Maintenance
router.delete('/delete_schedule/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM maintenance WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error" + err });
    }
});

// Endpoint to get zones
router.get('/get_zones', authenticateToken, async (req, res) => {
    try {
        const getZonesQuery = 'SELECT DISTINCT zone FROM school';
        const [zones] = await db.query(getZonesQuery);
        res.json({ zones: zones.map(z => z.zone) });
    } catch (err) {
        console.error('Error fetching zones:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;





