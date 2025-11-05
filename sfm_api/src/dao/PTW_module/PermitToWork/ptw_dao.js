import db from "../../../config/db_config.js";

export default class PermitToWorkDao {
  static async createPermitToWork({
    appId,
    ptId,
    flowId,
    checklistId,
    userId,
    activeStatus,
  }) {
    const sql = `INSERT INTO m_permit_to_work(appId,ptId, flowId, checklistId, userId, activeStatus)
                    VALUES(?,?,?,?,?,?)`;
    try {
      await db.execute(sql, [
        appId,
        ptId,
        flowId,
        checklistId,
        userId,
        activeStatus,
      ]);
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }
  static async getAllPermitToWork() {
    const sql = `SELECT ptw.appId,ptw.appStatus,ptw.email,pt.ptId, pt.ptName,fl.flowId,pt.checklistId ,fl.statusName, fl.stepNo, a.displayName, a.userId,a.emailId,
                     DATE_FORMAT(ptw.updatedOn, '%d/%m/%Y %h:%i %p') AS updatedOn,
                     pr.createdBy, acc.displayName AS creatorName
                    FROM m_permit_to_work ptw
					LEFT JOIN m_permit_type pt ON ptw.ptId = pt.ptId 
                    LEFT JOIN m_flow_details fl ON pt.flowId = fl.flowId AND ptw.current_step_no = fl.stepNo
                    LEFT JOIN account a ON fl.userId = a.userId
                    LEFT JOIN m_ptw_response pr ON ptw.appId=pr.appId
                    LEFT JOIN account acc ON pr.createdBy = acc.userId
                   ORDER BY ptw.appId`;
    try {
      const [rows] = await db.execute(sql);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async getPermitToWorkById(appId) {
    const sql = `SELECT * FROM m_permit_to_work WHERE appId =?`;
    try {
      const [rows] = await db.execute(sql, [appId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

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

  static async getPermitTypeName() {
    const sql = `SELECT ptId, ptName, checklistId,flowId,reqId,remarks,active FROM m_permit_type`;
    try {
      const [rows] = await db.execute(sql);
      return rows;
    } catch (error) {
      console.error("Error executing SQL: ", error);
      throw error;
    }
  }

  static async addMultipleChecklistResponses(
    ptId,
    activeStatus,
    createdBy,
    responses,
    statusName,
    signOffRemarks,
    userId,
    signature,
    processedAt
  ) {
    const insertPTWSql = `INSERT INTO m_permit_to_work (ptId, activeStatus, createdBy)
                              VALUES (?, ?, ?)`;
    const insertAppSignOffSql = `INSERT INTO app_sign_off (appId, statusName, signOff_remarks, userId, signature)
                                     VALUES (?, ?, ?, ?, ?)`;
    const insertResponseSql = `INSERT INTO m_ptw_response (appId, serialNo, checkOptions, remarks, createdBy)
                                   VALUES (?, ?, ?, ?, ?)`;

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Validate that at least one of createdBy or email is provided
      if (!ptId || !activeStatus || !createdBy) {
        throw new Error("ptId, activeStatus createdBy must be provided");
      }

      // Insert permit-to-work data
      const [result] = await connection.execute(insertPTWSql, [
        ptId,
        activeStatus,
        createdBy,
      ]);
      const appId = result.insertId;

      // Insert app_sign_off data
      await connection.execute(insertAppSignOffSql, [
        appId,
        statusName,
        signOffRemarks || null,
        userId || null,
        signature || null,
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
          createdBy,
        ]);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("Error executing SQL for multiple responses: ", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getSignOff(appId) {
    const sql = `SELECT ptw.appId, fl.declaration 
                    FROM m_permit_to_work ptw 
                    JOIN 
                    m_permit_type pt ON ptw.ptId = pt.ptId 
                    JOIN 
                    m_flow_details fl ON pt.flowId = fl.flowId AND ptw.current_step_no=fl.stepNo
                    WHERE appId=?`;
    try {
      const [result] = await db.execute(sql, [appId]);
      return result;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async addSignOff(
    appId,
    statusName,
    signOffRemarks,
    userId,
    signature
  ) {
    // SQL queries
    const checkCountSql = `
            SELECT ptw.appId, COUNT(*) AS stepCount
            FROM m_permit_to_work ptw
            JOIN m_permit_type pt ON ptw.ptId = pt.ptId 
            JOIN m_flow_details fl ON pt.flowId = fl.flowId
            WHERE ptw.appId = ?
            GROUP BY ptw.appId;
        `;

    const getCurrentStepSql = `
            SELECT current_step_no 
            FROM m_permit_to_work 
            WHERE appId = ?;
        `;

    const getAppStatusSql = `
            SELECT appStatus
            FROM m_permit_to_work
            WHERE appId = ?;
        `;

    // Get the total steps
    const [checkCount] = await db.execute(checkCountSql, [appId]);
    if (checkCount.length === 0) {
      throw new Error("Application not found");
    }
    const signOffStep = checkCount[0].stepCount;

    // Get the current step and app status
    const [currentStepResult] = await db.execute(getCurrentStepSql, [appId]);
    if (currentStepResult.length === 0) {
      throw new Error("Current step not found for the application");
    }
    const currentStepCount = currentStepResult[0].current_step_no;

    const [appStatusResult] = await db.execute(getAppStatusSql, [appId]);
    if (appStatusResult.length === 0) {
      throw new Error("Application status not found");
    }
    const appStatus = appStatusResult[0].appStatus;

    if (appStatus === "Completed") {
      // Application is already completed; restrict further sign-off
      return {
        success: false,
        message:
          "The application is already completed and cannot be signed off.",
        appStatus,
      };
    }

    // Determine if all steps are completed
    let updateSql;
    if (currentStepCount === signOffStep) {
      // All steps are completed
      updateSql = `
                UPDATE m_permit_to_work 
                SET workStatus = 1, appStatus = 'Completed'
                WHERE appId = ?;
            `;
    } else {
      // Update current step
      updateSql = `
                UPDATE m_permit_to_work 
                SET current_step_no = current_step_no + 1
                WHERE appId = ?;
            `;
    }

    // Execute the update query
    const response = await db.execute(updateSql, [appId]);

    // Insert into app_sign_off
    const insertSignOffSql = `
            INSERT INTO app_sign_off (appId, statusName, signOff_remarks, userId, signature, processedAt) 
            VALUES (?, ?, ?, ?, ?, NOW())`;
    await db.execute(insertSignOffSql, [
      appId,
      statusName,
      signOffRemarks,
      userId,
      signature,
    ]);

    // Return success response
    return {
      success: true,
      message: "Sign off successful.",
      appStatus: "Completed", // or update this to reflect the new appStatus if not completed
    };
  }

  static async getChecklistResponse(appId) {
    const sql = `SELECT ptw.appId, c.cName, cl.checklistId, cl.serialNo, cl.description, rs.checkOptions, rs.remarks, 
                            DATE_FORMAT(ptw.createdOn, '%d/%m/%Y %h:%i %p') AS createdOn
                        FROM 
                            m_permit_to_work ptw 
                        JOIN
                            m_permit_type pt ON ptw.ptId = pt.ptId
                        JOIN
	                        m_checklist c ON pt.checklistId=c.checklistId
                        JOIN
                            m_checklist_details cl ON  pt.checklistId = cl.checklistId
                        JOIN
                            m_ptw_response rs ON ptw.appId = rs.appId  AND cl.serialNo = rs.serialNo
                        WHERE 
                            ptw.appId = ?`;
    try {
      const [rows] = await db.execute(sql, [appId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async getSignOffHistory(appId) {
    const sql = `SELECT s.appId, s.statusName, s.signOff_remarks, IFNULL(a.displayName,s.email) AS displayName, s.signature,
                       DATE_FORMAT(s.processedAt, '%d/%m/%Y %h:%i %p') AS processedAt,
                       DATE_FORMAT(s.createdOn, '%d/%m/%Y %h:%i %p') AS createdOn
                       FROM app_sign_off s
                       LEFT JOIN account a ON s.userId = a.userId
                       WHERE s.appId = ?
                       ORDER BY s.processedAt DESC`;

    try {
      const [rows] = await db.execute(sql, [appId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async deletePermitToWork(appId) {
    const sql = `DELETE FROM m_permit_to_work WHERE appId=?`;
    try {
      await db.execute(sql, [appId]);
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async updateAssignment(flowId, stepNo, userId, updatedBy) {
    const sql = `UPDATE m_flow_details SET userId=?, updatedBy=? WHERE flowId=? AND stepNo=?`;
    try {
      await db.execute(sql, [userId, updatedBy, flowId, stepNo]);
      return true;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async updatePermitStatus(appId, workStatus, appStatus, updatedBy) {
    const updatePermitSql = `UPDATE m_permit_to_work SET workStatus=?, appStatus=?, updatedBy=? WHERE appId=?`;

    try {
      await db.execute(updatePermitSql, [
        workStatus,
        appStatus,
        updatedBy,
        appId,
      ]);
      return true;
    } catch (err) {
      console.error("Error updating permit status: ", err);
      throw err;
    }
  }

  static async insertAppSignOff(appId, statusName, userId) {
    const insertSignOffSql = `
                INSERT INTO app_sign_off (appId, statusName, userId, processedAt) 
                VALUES (?, ?, ?, NOW())`;

    try {
      await db.execute(insertSignOffSql, [appId, statusName, userId]);
      return true;
    } catch (err) {
      console.error("Error inserting sign off: ", err);
      throw err;
    }
  }

  static async requestChange(appId, statusName, userId, signOffRemarks) {
    const signOffSql = `INSERT INTO app_sign_off (appId, statusName, userId, signOff_remarks, processedAt)
                                VALUES (?, ?, ?, ?, NOW())`;
    try {
      await db.execute(signOffSql, [appId, statusName, userId, signOffRemarks]);
      return true;
    } catch (err) {
      console.error("Error requesting change: ", err);
      throw err;
    }
  }

  static async restartAppFlow(appId) {
    const updateAppFlow = `UPDATE m_permit_to_work SET current_step_no = 1, appStatus='Change Requested' WHERE appId = ?`;
    try {
      await db.execute(updateAppFlow, [appId]);
      return true;
    } catch (err) {
      console.error("Error restarting application flow: ", err);
      throw err;
    }
  }

  static async updateChecklistResponse(
    appId,
    serialNo,
    checkOptions,
    remarks,
    updatedBy
  ) {
    const checklistResponseSql = `UPDATE m_ptw_response SET checkOptions=?, remarks=?, updatedBy=? WHERE appId=? AND serialNo=?`;
    try {
      await db.execute(checklistResponseSql, [
        checkOptions,
        remarks,
        updatedBy,
        appId,
        serialNo,
      ]);
      return true;
    } catch (err) {
      console.error("Error updating checklist response: ", err);
      throw err;
    }
  }

  static async updateAppStatus(appId, appStatus, updatedBy) {
    const updateAppStatusSql = `UPDATE m_permit_to_work SET appStatus=?, updatedBy=? WHERE appId=?`;
    try {
      await db.execute(updateAppStatusSql, [appStatus, updatedBy, appId]);
      return true;
    } catch (err) {
      console.error("Error updating application status: ", err);
      throw err;
    }
  }

  static async getChecklistPdf(appId) {
    const sql = `SELECT ptw.appId,  cl.checklistId,  cl.serialNo, cl.description,  rs.checkOptions, rs.remarks, 
                       rs.createdBy, rs.updatedBy, DATE_FORMAT(rs.updatedOn, '%d/%m/%Y %h:%i %p') AS updatedOn, 
                       DATE_FORMAT(rs.createdOn, '%d/%m/%Y %h:%i %p') AS createdOn, acc.displayName AS creatorName, 
                       a.displayName AS updatorName, a.userId
                FROM 
                    m_permit_to_work ptw
                JOIN
                    m_permit_type pt ON ptw.ptId = pt.ptId
                JOIN
                     m_checklist c ON pt.checklistId = c.checklistId
                JOIN
                    m_checklist_details cl ON pt.checklistId = cl.checklistId
                JOIN
                    m_ptw_response rs ON ptw.appId = rs.appId AND cl.serialNo = rs.serialNo
                LEFT JOIN 
                     account acc ON rs.createdBy = acc.userId
                LEFT JOIN
                    account a ON rs.updatedBy = a.userId
                WHERE 
                    ptw.appId = ?
                ORDER BY 
                    cl.serialNo`;

    try {
      const [rows] = await db.execute(sql, [appId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async getSignOffPdf(appId) {
    const sql = `SELECT ptw.appId, fl.stepNo,fl.statusName AS flowStatusName, fl.declaration, ap.userId, ap.signature,
                       DATE_FORMAT( ap.processedAt, '%d/%m/%Y %h:%i %p') AS  processedAt,ap.signOff_remarks,ap.statusName AS appStatusName, acc.displayName 
                     FROM 
                       m_permit_to_work ptw
                    JOIN 
                       m_permit_type pt ON ptw.ptId = pt.ptId
                    JOIN 
                       m_flow_details fl ON pt.flowId = fl.flowId
                    LEFT JOIN 
                       app_sign_off ap ON fl.statusName = ap.statusName AND ptw.appId = ap.appId
                    LEFT JOIN 
                        account acc ON ap.userId = acc.userId
                    WHERE 
                        ptw.appId = ?
                    ORDER BY 
                        fl.stepNo ASC`;

    try {
      const [rows] = await db.execute(sql, [appId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }
}
