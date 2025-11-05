import { Router } from 'express';
import db from '../../../config/db_config.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

// Add Booking Route
router.post('/add_booking', authenticateToken, async (req, res) => {
    const { zone, schoolName, block, level, roomNo, roomName, date, timeStart, timeEnd, remarks, equipment } = req.body;

        const sql = `INSERT INTO bookings 
            (zone, schoolName, block, level, roomNo, roomName, date, timeStart, timeEnd, remarks, equipment) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            zone,
            schoolName,
            block,
            level,
            roomNo,
            roomName,
            date,
            timeStart,
            timeEnd,
            remarks || null,
            JSON.stringify(equipment)
        ];
try{
            await db.query(sql, values);
        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, Error: err.message });
    }
});

const updateBookingStatuses = async () => {
    // Query to update status to 'ongoing'
    const updateOngoing = `
      UPDATE bookings
      SET status = 'ongoing'
      WHERE CURRENT_DATE = date
      AND CURRENT_TIME >= timeStart
      AND CURRENT_TIME <= timeEnd
      AND status = 'upcoming'`;

    // Query to update status to 'completed'
    const updateCompleted = `
      UPDATE bookings
      SET status = 'completed'
      WHERE CURRENT_DATE = date
      AND CURRENT_TIME > timeEnd
      AND status IN ('upcoming', 'ongoing')`;

    // Query to update status back to 'upcoming' for bookings that are not started yet
    const updateUpcoming = `
      UPDATE bookings
      SET status = 'upcoming'
      WHERE CURRENT_DATE = date
      AND CURRENT_TIME < timeStart
      AND status != 'upcoming'`;

    try {
        // Execute the 'ongoing' update query
        await db.query(updateOngoing);
        
        // Execute the 'completed' update query
        await db.query(updateCompleted);
        
        // Execute the 'upcoming' update query
        await db.query(updateUpcoming);
    } catch (err) {
        console.error('Error updating booking statuses:', err);
    }
};

// Call the function every minute (60 seconds)
setInterval(updateBookingStatuses, 60 * 1000);



// Edit Booking
router.get('/get_booking/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM bookings WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error" });
    }
});

router.put('/edit_booking/:id', authenticateToken ,async (req, res) => {
    const id = req.params.id;
    const sql = `
        UPDATE bookings 
        SET 
            zone = ?, schoolName = ?, block = ?, level = ?, roomNo = ?, roomName = ?, date = ?, timeStart = ?, 
            timeEnd = ?, remarks = ?, equipment = ? 
        WHERE id = ?`;

    const values = [
        req.body.zone,        // Zone of the booking
        req.body.schoolName,  // School name
        req.body.block,       // Block
        req.body.level,       // Level
        req.body.roomNo,      // Room number
        req.body.roomName,    // Room name
        req.body.date,        // Date of the booking (make sure it's in 'YYYY-MM-DD' format)
        req.body.timeStart,   // Start time (make sure it's in 'HH:mm' format)
        req.body.timeEnd,     // End time (make sure it's in 'HH:mm' format)
        req.body.remarks,     // Remarks
        JSON.stringify(req.body.equipment), // Equipment details as a JSON string
    ];
    try {
        const [result] = await db.query(sql, [...values, id]);
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error('Query Error:', err);
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// Get Booking
router.get('/booking', authenticateToken, async (req, res) => {
    try {
        const sql = "SELECT * FROM bookings WHERE status IN ('upcoming', 'ongoing')";
        const [results] = await db.query(sql);
        res.status(200).json({ Status: true, data: results });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ Status: false, Error: 'Error fetching data' });
    }
});



// Delete Booking
router.delete('/delete_booking/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM bookings WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        res.json({ Status: true, Result: result });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error" + err });
    }
});


// Endpoint to get zones
router.get('/get_zones', authenticateToken , async (req, res) => {
    try {
        const getZonesQuery = 'SELECT DISTINCT zone FROM school';
        const [zones] = await db.query(getZonesQuery);
        res.json({ zones: zones.map(z => z.zone) });
    } catch (err) {
        console.error('Error fetching zones:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get schools by zone
router.post('/get_schools_by_zone', authenticateToken, async (req, res) => {
    const { zone } = req.body;

    if (!zone) {
        return res.status(400).json({ error: 'Missing required field: zone' });
    }

    try {
        const getSchoolsQuery = 'SELECT id, school_name FROM school WHERE zone = ?';
        const [schools] = await db.query(getSchoolsQuery, [zone]);
        res.json({ schools });
    } catch (err) {
        console.error('Error fetching schools:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get blocks by school
router.post('/get_blocks_by_school', authenticateToken, async (req, res) => {
    const { schoolId } = req.body;

    if (!schoolId) {
        return res.status(400).json({ error: 'Missing required field: schoolId' });
    }

    try {
        const getBlocksQuery = 'SELECT DISTINCT block FROM location WHERE school_id = ?';
        const [blocks] = await db.query(getBlocksQuery, [schoolId]);
        res.json({ blocks: blocks.map(b => b.block) });
    } catch (err) {
        console.error('Error fetching blocks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get levels by school and block
router.post('/get_levels_by_school_and_block', authenticateToken, async (req, res) => {
    const { schoolId, block } = req.body;

    if (!schoolId || !block) {
        return res.status(400).json({ error: 'Missing required fields: schoolId or block' });
    }

    try {
        const getLevelsQuery = 'SELECT DISTINCT level FROM location WHERE school_id = ? AND block = ?';
        const [levels] = await db.query(getLevelsQuery, [schoolId, block]);
        res.json({ levels: levels.map(l => l.level) });
    } catch (err) {
        console.error('Error fetching levels:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get rooms by school, block, and level
router.post('/get_rooms_by_school_block_level', authenticateToken, async (req, res) => {
    const { schoolId, block, level } = req.body;

    if (!schoolId || !block || !level) {
        return res.status(400).json({ error: 'Missing required fields: schoolId, block, or level' });
    }

    try {
        const getRoomsQuery = 'SELECT room_no FROM location WHERE school_id = ? AND block = ? AND level = ?';
        const [rooms] = await db.query(getRoomsQuery, [schoolId, block, level]);
        res.json({ rooms });
    } catch (err) {
        console.error('Error fetching rooms:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to get room details including the school based on room number
router.post('/get_room_details', authenticateToken, async (req, res) => {
    const { roomNo } = req.body;

    if (!roomNo) {
        return res.status(400).json({ error: 'Missing required field: roomNo' });
    }

    try {
        // Fetch room details based on room number
        const getRoomDetailsQuery = `
            SELECT room_no, room_name, level, block, school_id
            FROM location
            WHERE room_no = ?
        `;
        const [roomResults] = await db.query(getRoomDetailsQuery, [roomNo]);

        if (roomResults.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const room = roomResults[0];

        // Fetch school details based on the school_id from the room
        const getSchoolQuery = 'SELECT school_name FROM school WHERE id = ?';
        const [schoolResults] = await db.query(getSchoolQuery, [room.school_id]);

        if (schoolResults.length === 0) {
            return res.status(404).json({ error: 'School not found' });
        }

        const school = schoolResults[0];

        // Send the room and school details in the response
        res.json({
            room_name: room.room_name,
            school_name: school.school_name,
        });
    } catch (err) {
        console.error('Error fetching room or school details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
