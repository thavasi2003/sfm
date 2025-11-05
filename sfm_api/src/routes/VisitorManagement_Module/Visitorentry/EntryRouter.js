import express from "express";
import authenticateToken from "../../../middlewares/auth.js"; // Authentication middleware
import db from "../../../config/db_config.js"; // Database configuration

const router = express.Router();

// Fetch visitor details by visitor code
router.post("/get_visitor_by_code", authenticateToken, async (req, res) => {
  const { visitor_code } = req.body;

  if (!visitor_code) {
    return res.status(400).json({ message: "Visitor code is required" });
  }

  try {
    // Check if the visitor has already been added in visitor_entry table
    const [existingVisitor] = await db.query(
      "SELECT * FROM visitor_entry WHERE visitor_code = ?",
      [visitor_code]
    );

    if (existingVisitor.length) {
      return res
        .status(409)
        .json({ message: "Visitor has already been checked in." });
    }

    // If not checked in, fetch the visitor details from visitor_management
    const [visitor] = await db.query(
      "SELECT * FROM visitor_management WHERE visitor_code = ?",
      [visitor_code]
    );

    if (visitor.length) {
      res.json({ visitor: visitor[0] });
    } else {
      res.status(404).json({ message: "Visitor not found" });
    }
  } catch (error) {
    console.error("Error fetching visitor details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new visitor entry
router.post("/add_visitor", authenticateToken, async (req, res) => {
  const sql = `
    INSERT INTO visitor_entry  
      (visitor_code, visitor_name, expected_arrival_time, from_organization, check_in, check_out, image)  
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const check_out = null; // Use null if no check-out time
  const image = req.body.image || null; // Set to null if image is missing

  const values = [
    req.body.visitor_code,
    req.body.visitor_name,
    req.body.expected_arrival_time,
    req.body.from_organization,
    req.body.check_in,
    check_out,
    image,
  ];

  try {
    const [result] = await db.query(sql, values);
    res.json({ Status: true, Result: result });
  } catch (err) {
    res.status(500).json({ Status: false, Error: err.message });
  }
});

// Fetch all visitors
router.get("/get_all_visitors", authenticateToken, async (req, res) => {
  const sql = "SELECT * FROM visitor_entry";
  try {
    const [result] = await db.query(sql);
    res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Error fetching visitors:", err.message);
    res
      .status(500)
      .json({
        Status: false,
        Error: "Failed to fetch visitors.",
        Details: err.message,
      });
  }
});

// Check-out visitor
router.put("/check_out/:id", authenticateToken, async (req, res) => {
  const visitorId = req.params.id;
  const checkOutTime = req.body.check_out;

  try {
    // Update the visitor entry with the current check_out time
    const result = await db.query(
      "UPDATE visitor_entry SET check_out = ? WHERE id = ?",
      [checkOutTime, visitorId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Visitor not found" });
    }

    res.json({ Status: true, Message: "Check out time recorded successfully" });
  } catch (err) {
    console.error("Error updating check out time:", err);
    res
      .status(500)
      .json({ Status: false, Error: "Error recording check out time" });
  }
});

export default router;
