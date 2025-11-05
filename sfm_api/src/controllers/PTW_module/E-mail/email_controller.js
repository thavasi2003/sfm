import EmailService from "../../../services/PTW_module/E-mail/email_service.js";
import crypto from "crypto";
import db from "../../../config/db_config.js";

// Function to generate a token
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Helper function for base64 encoding in Node.js
function toBase64(str) {
  return Buffer.from(str).toString("base64");
}

export default class EmailController {
  static async sendNotification(req, res) {
    let connection;
    try {
      // Destructure relevant data from the request body
      const { email, checklistId, permitTypeName, username, permitType } =
        req.body;

      // Generate a token and set expiration time
      const token = generateToken();
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);

      // Create a link using base64 encoding
      const link = `http://coedev.smartbuildinginspection.com/complete_permit_to_work/${toBase64(
        email
      )}/${toBase64(permitType)}/${token}`;

      // Get a connection from the pool
      connection = await db.getConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Check if a token already exists for this checklistId and email
      const [existingToken] = await connection.query(
        "SELECT COUNT(*) as count FROM checklist_token WHERE token=?",
        [token]
      );

      // Insert the token only if it doesn't already exist
      if (existingToken[0].count === 0) {
        await connection.execute(
          "INSERT INTO checklist_token (email, checklistId, token, used, expiration) VALUES (?, ?, ?, ?, ?)",
          [email, checklistId, token, false, expiration]
        );
      }

      // Commit the transaction
      await connection.commit();

      // Set the email subject
      const subject = `Permit to Work Application`;

      // Prepare the email content
      const mailContent = `
                <h1>Permit to Work Application: ${permitTypeName}</h1>
                <p>${username} has sent you a Permit to Work Application: <strong>${permitTypeName}</strong> for completion.</p>
                <p>- Link to <a href="${link}" target="_blank">Permit to Work Application</a></p>
            `;

      // Send the email
      await EmailService.sendNotification(email, subject, mailContent);

      // Return a successful response
      res.status(201).json({ status: "success" });
    } catch (err) {
      if (connection) {
        // Rollback the transaction if an error occurs
        await connection.rollback();
      }
      console.error("Error in sendNotification controller:", err);
      res.status(500).json({ status: "failed", error: err.message });
    } finally {
      if (connection) {
        // Release the connection back to the pool
        await connection.release();
      }
    }
  }
}
