import PermitToWorkService from "../../../services/PTW_module/PermitToWork/ptw_service.js";
import handleError from "../../../utils/pt_utils.js";
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

export default class PermitToWorkController {
  static async getAllPermitToWorkController(req, res) {
    try {
      const permitToWork = await PermitToWorkService.getAllPermitToWork();
      return res.status(200).json({ status: "success", data: permitToWork });
    } catch (err) {
      console.error("Error in getAllPermitToWorkController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async getPermitToWorkByIdController(req, res) {
    try {
      const { ptId } = req.params;
      const permitToWork = await PermitToWorkService.getPermitTypeByIdService(
        ptId
      );
      if (!permitToWork) return res.status(404).json({ status: "not found" });
      return res.status(200).json({ status: "success", data: permitToWork });
    } catch (err) {
      console.error("Error in getPermitToWorkByIdController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async getPermitTypeNameController(req, res) {
    try {
      const permitTypeName =
        await PermitToWorkService.getPermitTypeNameService();
      if (!permitTypeName) return res.status(404).json({ status: "not found" });
      return res.status(200).json({ status: "success", data: permitTypeName });
    } catch (err) {
      handleError(res, err);
      console.error("Error in getPermitTypeNameController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async addChecklistResponseController(req, res) {
    const payload = req.body;

    // Validate payload structure
    if (
      !payload.ptId ||
      !payload.activeStatus ||
      !payload.createdBy ||
      !Array.isArray(payload.responses)
    ) {
      return res.status(400).json({
        status: "invalid request",
        message: "Invalid payload structure",
      });
    }

    // Ensure each response object has the necessary properties
    if (
      payload.responses.some(
        (response) =>
          response.serialNo === undefined || response.checkOptions === undefined
      )
    ) {
      return res.status(400).json({
        status: "invalid request",
        message: "Each response must include serialNo and checkOptions",
      });
    }

    try {
      await PermitToWorkService.addMultipleChecklistResponsesService(payload);
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in addChecklistResponseController: ", err);

      // Check for duplicate entry error
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          status: "failed",
          message:
            "Duplicate entry error: One or more responses already exist.",
        });
      }

      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  }

  static async getSignOffController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      const signOff = await PermitToWorkService.getSignOffService(appId);
      return res.json({ status: "success", data: signOff });
    } catch (err) {
      console.error("Error in getSignOffController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async addSignOffController(req, res) {
    const { appId } = req.params;
    const { statusName, signOffRemarks, userId, signature, email } = req.body;

    if (!appId || !statusName || !signOffRemarks || !userId || !signature) {
      return res.status(400).json({
        status: "error",
        message: "Application Id or Sign-off details not found",
      });
    }
    try {
      await PermitToWorkService.addSignOffService(
        appId,
        statusName,
        signOffRemarks,
        userId,
        signature
      );

      const result = await PermitToWorkService.getPermitToWorkByIdService(
        appId
      );

      if (email && result[0].appStatus === "Completed") {
        const subject = `Permit To Work Application PTW${appId}: Status updated`;

        const mailContent = `<p><h1>The status of Permit to Work Application ID:${appId} has been updated to <strong>Work Completed</strong></h1></p>
                        <p> Permit to Work Application ID: <strong>PTW${appId}</strong></p>
                       <p><strong> This is an automated notification email. Please do not reply to this email.</strong></p>`;

        await EmailService.sendNotification(email, subject, mailContent);
      }

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in addSignOffController: ", err);
      return res.status(500).json({ status: "failed", message: err.message });
    }
  }

  static async getChecklistResponseController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      const checklistResponse =
        await PermitToWorkService.getChecklistResponseService(appId);
      return res.json({ status: "success", data: checklistResponse });
    } catch (err) {
      console.error("Error in getChecklistResponseController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async getSignOffHistoryController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      const signOffHistory = await PermitToWorkService.getSignOffHistoryService(
        appId
      );
      return res.json({ status: "success", data: signOffHistory });
    } catch (err) {
      console.error("Error in getSignOffHistoryController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async deletePermitToWorkController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      await PermitToWorkService.deletePermitToWorkService(appId);
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in deletePermitToWorkController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async updateAssignmentController(req, res) {
    const { userId, updatedBy } = req.body;

    const { flowId, stepNo } = req.params;

    if (!userId || !flowId || !stepNo) {
      return res
        .status(404)
        .json({ status: "User Id, Flow Id or Step No not found" });
    }
    try {
      await PermitToWorkService.updateAssignmentService(
        flowId,
        stepNo,
        userId,
        updatedBy
      );

      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in updateAssignmentController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }
  static async cancelPermitToWorkController(req, res) {
    const { appId } = req.params;
    const { workStatus, appStatus, statusName, userId, updatedBy } = req.body;

    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }

    try {
      await PermitToWorkService.cancelPermitToWorkService(
        appId,
        workStatus,
        appStatus,
        statusName,
        userId,
        updatedBy
      );
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in cancelPermitToWorkController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async restartAppFlowController(req, res) {
    const {
      appId,
      statusName,
      userId,
      signOffRemarks,
      username,
      email,
      checklistId,
      ptId,
    } = req.body;
    if (
      !appId ||
      !statusName ||
      !userId ||
      !signOffRemarks ||
      !username ||
      !checklistId ||
      !ptId
    ) {
      return res.status(400).json({
        status:
          "Application Id, Status Name, User Id, username, email, checklistId, ptId, or Sign-off Remarks not found",
      });
    }

    let connection;

    try {
      const result = await PermitToWorkService.restartAppFlowService(
        appId,
        statusName,
        userId,
        signOffRemarks
      );

      if (email) {
        // Generate a token and set expiration time
        const token = generateToken();
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);

        // Ensure ptId is treated as a string for base64 encoding
        const link = `http://coedev.smartbuildinginspection.com/request_change_permit_to_work/${toBase64(
          email
        )}/${toBase64(ptId.toString())}/${toBase64(appId.toString())}/${token}`;

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

        const subject = `Permit to Work PTW${appId}: Change requested`;

        const mailContent = `
                <p><h1>${username} has requested a change in the Permit to Work Application</h1></p>
                <ul>
                    <li><p>Permit to Work ID: PTW${appId}</p></li>
                    <li><p>Remarks: ${signOffRemarks}</p></li>
                </ul>
                <p><a href="${link}" target="_blank">Link to resubmit Application</a></p>
                <p><strong>This is an automated notification email. Please do not reply to this email.</strong></p>
            `;

        const response = await EmailService.sendNotification(
          email,
          subject,
          mailContent
        );
      }
      return res.status(200).json(result);
    } catch (err) {
      if (connection) {
        // Rollback the transaction if an error occurs
        await connection.rollback();
      }
      res.status(500).json({
        status: "failed",
        message: "Failed to restart application flow.",
        error: err.message,
      });
    } finally {
      if (connection) {
        // Release the connection back to the pool
        await connection.release();
      }
    }
  }
  static async updateChecklistResponseController(req, res) {
    const { appId } = req.params;
    const payload = req.body;

    try {
      for (const item of payload) {
        const { serialNo, checkOptions, remarks, updatedBy } = item;
        if (!appId || !serialNo || !checkOptions || !remarks || !updatedBy) {
          return res.status(400).json({
            status:
              "Application Id, Serial No, Check Options or Updated By not found",
          });
        }
        await PermitToWorkService.updateChecklistResponseService(
          appId,
          serialNo,
          checkOptions,
          remarks,
          updatedBy
        );
      }
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in updateChecklistResponseController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async updateAppStatusController(req, res) {
    const { appStatus, updatedBy } = req.body;
    const { appId } = req.params;
    if (!appId || !updatedBy) {
      return res
        .status(400)
        .json({ status: "Application Id or Updated By not found" });
    }
    try {
      await PermitToWorkService.updateAppStatusService(
        appId,
        appStatus,
        updatedBy
      );
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in updateAppStatusController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async insertAppSignOffController(req, res) {
    const { appId, statusName, userId } = req.body;
    if (!appId || !statusName || !userId) {
      return res
        .status(400)
        .json({ status: "Application Id, Status Name, User Id not found" });
    }
    try {
      await PermitToWorkService.insertAppSignOffService(
        appId,
        statusName,
        userId
      );
      return res.status(200).json({ status: "success" });
    } catch (err) {
      console.error("Error in insertAppSignOffService: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async getChecklistPdfController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      const result = await PermitToWorkService.getChecklistPdfService(appId);
      return res.status(200).json({ status: "success", data: result });
    } catch (err) {
      console.error("Error in getChecklistPdfController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }

  static async getSignOffPdfController(req, res) {
    const { appId } = req.params;
    if (!appId) {
      return res.status(404).json({ status: "Application Id not found" });
    }
    try {
      const result = await PermitToWorkService.getSignOffPdfService(appId);
      return res.status(200).json({ status: "success", data: result });
    } catch (err) {
      console.error("Error in getSignOffPdfController: ", err);
      return res.status(500).json({ status: "failed" });
    }
  }
}
