import db from "../../../config/db_config.js";

export default class PermitToWorkEmailDao {
  static async getPermitTypeById(ptId) {
    const sql = `SELECT pt.ptId,pt.ptName, d.checklistId, d.serialNo, d.description
                 FROM m_permit_type pt
                 LEFT JOIN m_checklist_details d ON d.checklistId = pt.checklistId
                 WHERE pt.ptId = ?
                 ORDER BY serialNo`;
    try {
      const [result] = await db.execute(sql, [ptId]);
      return result;
    } catch (error) {
      console.error("Error executing SQL: ", error);
      throw error;
    }
  }

  static async addMultipleChecklistResponses(
    token,
    ptId,
    activeStatus,
    email,
    responses,
    statusName,
    signOffRemarks,
    signature,
    processedAt
  ) {
    const insertPTWSql = `INSERT INTO m_permit_to_work (ptId, activeStatus, email)
                              VALUES (?, ?, ?)`;
    const insertAppSignOffSql = `INSERT INTO app_sign_off (appId, statusName, signOff_remarks, signature, processedAt, email)
                                     VALUES (?, ?, ?, ?, ?, ?)`;
    const insertResponseSql = `INSERT INTO m_ptw_response (appId, serialNo, checkOptions, remarks, email)
                                   VALUES (?, ?, ?, ?, ?)`;
    const updateChecklistTokenSql = `UPDATE checklist_token SET used = true WHERE token = ?`;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Validate that at least one of createdBy or email is provided
      if (!ptId || !activeStatus || !email) {
        throw new Error("ptId, activeStatus, email must be provided");
      }

      // Insert permit-to-work data
      const [result] = await connection.execute(insertPTWSql, [
        ptId,
        activeStatus,
        email,
      ]);
      const appId = result.insertId;

      // Insert app_sign_off data
      await connection.execute(insertAppSignOffSql, [
        appId,
        statusName,
        signOffRemarks || null,
        signature || null,
        processedAt || null,
        email || null,
      ]);

      for (let response of responses) {
        const { serialNo, checkOptions, remarks } = response;

        // Validate response data
        if (serialNo === undefined || checkOptions === undefined) {
          throw new Error(
            "serialNo and checkOptions must be provided for each response"
          );
        }

        // Handle undefined remarks
        const remarksValue = remarks !== undefined ? remarks : null;
        await connection.execute(insertResponseSql, [
          appId,
          serialNo,
          checkOptions,
          remarksValue,
          email,
        ]);

        // Mark the token as used
        await db.query(updateChecklistTokenSql, [token]);
      }

      await connection.commit();
      return appId;
    } catch (error) {
      await connection.rollback();
      console.error("Error executing SQL for multiple responses: ", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateChecklistResponse(appId, serialNo, checkOptions, remarks) {
    const checklistResponseSql = `UPDATE m_ptw_response SET checkOptions=?, remarks=? WHERE appId=? AND serialNo=?`;
    try {
      await db.execute(checklistResponseSql, [
        checkOptions,
        remarks,
        appId,
        serialNo,
      ]);
      return true;
    } catch (err) {
      console.error("Error updating checklist response: ", err);
      throw err;
    }
  }

  static async updateAppStatus(appId, appStatus) {
    const updateAppStatusSql = `UPDATE m_permit_to_work SET appStatus='' WHERE appId=?`;
    try {
      const response = await db.execute(updateAppStatusSql, [appId]);
      return response;
    } catch (err) {
      console.error("Error updating application status: ", err);
      throw err;
    }
  }

  static async insertAppSignOff(appId, statusName, email) {
    const insertSignOffSql = `
            INSERT INTO app_sign_off (appId, statusName, email, processedAt) 
            VALUES (?, ?, ?, NOW())`;

    try {
      await db.execute(insertSignOffSql, [appId, statusName, email]);
      return true;
    } catch (err) {
      console.error("Error inserting sign off: ", err);
      throw err;
    }
  }
}
