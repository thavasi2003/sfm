import express from "express"; // Import express
import authenticateToken from "../../../middlewares/auth.js"; // Import the authentication middleware
import db from "../../../config/db_config.js"; // Import the database configuration
import EmailService from "../../../services/PTW_module/E-mail/email_service.js";

const router = express.Router(); // Use express.Router() correctly

// Utility function to format datetime to 'YYYY-MM-DD HH:MM:SS'
const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Utility function to generate a visitor_code with 4 letters and 4 numbers
const generateVisitorCode = () => {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const numbers = String(Math.floor(1000 + Math.random() * 9000));
  return `${letters}${numbers}`;
};

// Route: Add a visitor
router.post("/add_visitor", authenticateToken, async (req, res) => {
  const visitorData = Array.isArray(req.body) ? req.body[0] : req.body;
  const {
    requestor_name,
    visitor_name,
    visitor_email,
    expected_arrival_time,
    visiting_purpose,
  } = visitorData;

  if (!requestor_name || !visitor_name || !visitor_email || !visiting_purpose) {
    return res
      .status(400)
      .json({ Status: false, Error: "Required fields are missing." });
  }

  try {
    const visitor_code = generateVisitorCode();
    const created_at = new Date().toISOString().slice(0, 10);

    const visitorSql = `INSERT INTO visitor_management
      (requestor_name, visitor_name, visitor_email, expected_arrival_time, visiting_purpose, visitor_code, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const visitorValues = [
      requestor_name,
      visitor_name,
      visitor_email,
      expected_arrival_time,
      visiting_purpose,
      visitor_code,
      created_at,
    ];

    const [result] = await db.query(visitorSql, visitorValues);

    EmailService.sendNotification(
      visitor_email,
      "Visitor Invitation Confirmation",
      `Hello ${visitor_name},\n\nYour Visitor Code: ${visitor_code}, \nYour Expected Arrival Time: ${expected_arrival_time},\n invited for the below venue `
    );
    res.json({
      Status: true,
      Message: "Visitor added successfully.",
      VisitorID: result.insertId,
      visitor_code,
    });
  } catch (err) {
    console.error("Error adding visitor:", err.message);
    res.status(500).json({
      Status: false,
      Error: "Failed to add visitor.",
      Details: err.message,
    });
  }
});

// Route: Get all visitors
router.get("/visitors", authenticateToken, async (req, res) => {
  const sql = "SELECT * FROM visitor_management";
  try {
    const [result] = await db.query(sql);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Error fetching visitors:", err.message);
    res.status(500).json({
      Status: false,
      Error: "Failed to fetch visitors.",
      Details: err.message,
    });
  }
});

// Route: Get visitor by ID
router.get("/get_visitor/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM visitor_management WHERE id = ?";
  try {
    const [result] = await db.query(sql, [id]);
    res.json({ Status: true, Result: result });
  } catch (err) {
    res.json({ Status: false, Error: err.message });
  }
});

// Route: Delete a visitor by ID
router.delete("/delete_visitor/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM visitor_management WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        Status: false,
        Error: "Visitor not found or already deleted.",
      });
    }
    res.json({ Status: true, Message: "Visitor deleted successfully." });
  } catch (err) {
    console.error("Error deleting visitor:", err.message);
    res.status(500).json({
      Status: false,
      Error: "Failed to delete visitor.",
      Details: err.message,
    });
  }
});

// Route: Edit a visitor by ID
router.put("/edit_visitor/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const {
    requestor_name,
    visitor_name,
    visitor_email,
    expected_arrival_time,
    visiting_purpose,
  } = req.body;

  const sql = `UPDATE visitor_management
      SET requestor_name = ?, visitor_name = ?, visitor_email = ?, expected_arrival_time = ?, visiting_purpose = ?
      WHERE id = ?`;

  const values = [
    requestor_name,
    visitor_name,
    visitor_email,
    expected_arrival_time,
    visiting_purpose,
    id,
  ];

  try {
    const [result] = await db.query(sql, values);
    res.json({ Status: true, Result: result });
  } catch (err) {
    res.json({ Status: false, Error: err.message });
  }
});

export default router;
