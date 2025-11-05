import db from '../../../config/db_config.js';

export default class FlowDao{
    static async getAllFlowName(){
        const sql='SELECT flowId,flowName from m_flow';
        try{
        const [rows]=await db.execute(sql);
        return rows;
        }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }

    static async checkFlowName(flowName) {
        const sql = `SELECT COUNT(*) AS count FROM m_flow WHERE LOWER(flowName) = LOWER(?)`;
        try {
            const [result] = await db.query(sql, [flowName]);
            return result[0].count === 0; // Return true if unique
        } catch (err) {
            console.error('Error executing SQL: ', err);
            throw err; // Rethrow error to be caught by service
        }
    }

    static async getFlowNameById(flowId) {
        const sql=`SELECT flowId,flowName FROM m_flow WHERE flowId = ?`;
        try{
            const [rows]=await db.execute(sql, [flowId]);
            return rows[0];
        }catch (err) {
            console.error('Error executing SQL: ', err);
            throw err; // Rethrow error to be caught by service
        }
    }

    static async getFlowIndex(){
        const sql=`SELECT f.flowId, f.flowName,
                   (SELECT COUNT(*) FROM m_flow_details fd WHERE fd.flowId = f.flowId) AS nofSteps
                    FROM m_flow f;`;
        try{
            const [rows]=await db.execute(sql);
            return rows;
        }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }

    static async deleteFlowDetails(flowId) {
        const deleteFlowSql = 'DELETE FROM m_flow WHERE flowId = ?';
    
        try {
            // Delete the main flow
            const deleteFlowResult = await db.execute(deleteFlowSql, [flowId]);
    
            // Check if any rows were affected (i.e., the flow was successfully deleted)
            if (deleteFlowResult[0].affectedRows > 0) {
                return { status: 'deleteFlowDao: success' };
            } else {
                // If no rows were affected, return a status indicating this
                return { status: 'deleteFlowDao: no such flowId' };
            }
        } catch (err) {
            console.error('Error executing SQL in deleteFlowDetails:', err);
            throw err; // Ensure the error is rethrown
        }
    }
    

    static async createFlowName(flowName, createdBy) {
        const checkNameSql = `SELECT COUNT(*) AS count FROM m_flow WHERE LOWER(flowName) = LOWER(?)`;
        const createFlowNameSql = 'INSERT INTO m_flow(flowName, createdBy) VALUES(?, ?)';

        // Validate parameters
        if (!flowName || !createdBy) {
            throw new Error('Invalid parameters: flowName and createdBy are required.');
        }

        try {
            // Check if flow name is unique
            const [checkResult] = await db.query(checkNameSql, [flowName]);
            if (checkResult[0].count > 0) {
                throw new Error('Duplicate entry for flowName');
            }

            // Create flow name if it is unique
            const [result] = await db.execute(createFlowNameSql, [flowName, createdBy]);
            return result.insertId;
        } catch (error) {
            console.error('Error executing CreateFlowName SQL: ', error);
            throw error;
        }
    }

    static async createFlowDetails(flowId, stepNo, statusName, declaration, userId, createdBy) {
        const createFlowDetailsSql = 'INSERT INTO m_flow_details(flowId, stepNo, statusName, declaration, userId, createdBy) VALUES(?, ?, ?, ?, ?, ?)';

        // Validate parameters
        if (!flowId || !stepNo || !statusName || !declaration || !createdBy) {
            throw new Error('Invalid parameters: All parameters are required.');
        }

        try {
            await db.execute(createFlowDetailsSql, [flowId, stepNo, statusName, declaration, userId, createdBy]);
        } catch (error) {
            console.error('Error executing CreateFlowDetails SQL: ', error);
            throw error;
        }
    }
    static async updateFlowName(flowId,flowName,updatedBy){
        const checkNameSql = `SELECT COUNT(*) AS count FROM m_flow WHERE LOWER(flowName) = LOWER(?)`;
        const updateNameSql=`UPDATE m_flow SET flowName =?, updatedBy=? WHERE flowId =?`;

        try {
            // Check if flow name is unique
            const [checkResult] = await db.query(checkNameSql, [flowName]);
            if (checkResult[0].count > 0) {
                throw new Error('Duplicate entry for flowName');
            }

            // Update flow name if it is unique
            await db.execute(updateNameSql, [flowName,updatedBy, flowId]);
            return { status: 'updateFlowNameDao: success' }
        }catch(error){
            console.error('Error executing updateFlowName SQL: ', error);
            throw error;
        }
    }
   

    static async getFlowDetailsIndex(flowId){
         const sql = `SELECT fl.flowId, fl.flowName, f.flowId AS f_flowId, f.stepNo, f.statusName, f.declaration, f.userId, a.displayName
                      FROM m_flow fl
                      INNER JOIN m_flow_details f ON fl.flowId = f.flowId
                      LEFT JOIN account a ON f.userId = a.userId
                      WHERE fl.flowId = ?
                      ORDER BY f.stepNo`;
        try{
            const [rows]=await db.execute(sql, [flowId]);
            return rows;
        }catch(err){
            console.error('Error executing SQL: ', err);
        }
    }

    static async deleteFlowStep(flowId, stepNo){
        const deleteSql = `DELETE FROM m_flow_details WHERE flowId=? AND stepNo=?`;
        const updateSql = `UPDATE m_flow_details SET stepNo = stepNo - 1 WHERE flowId=? AND stepNo > ?`;

    try {
        // Delete the specified step
        await db.execute(deleteSql, [flowId, stepNo]);

        // Update subsequent steps' numbers
        await db.execute(updateSql, [flowId, stepNo]);

        return { status: 'deleteFlowStepDao: success' };
    } catch (err) {
        console.error('Error executing SQL: ', err);
        throw err; // Rethrow the error to be handled in the service layer
        }
    }

    static async updateFlowStep(flowId, stepNo, statusName, declaration, userId, updatedBy) {
        const sql = `UPDATE m_flow_details SET statusName=?, declaration=?, userId=?, updatedBy=? WHERE flowId=? AND stepNo=?`;
        const params = [statusName, declaration, userId || null, updatedBy, flowId, stepNo];
        try {
            const [result] = await db.execute(sql, params);
            return result;
        } catch (err) {
            console.error('Error executing updateFlowStep SQL: ', err);
            throw err;  // Re-throw the error after logging it
        }
    }

    static async addFlowStep(flowId, statusName, declaration, userId, createdBy) {
        const sql = `INSERT INTO m_flow_details (flowId, stepNo, statusName, declaration, userId, createdBy) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            // Get the maximum step number for the given flowId
            const getMaxStepNoSql = `SELECT MAX(stepNo) as maxStepNo FROM m_flow_details WHERE flowId = ?`;
            const [maxStepResult] = await db.execute(getMaxStepNoSql, [flowId]);
            const maxStepNo = maxStepResult[0].maxStepNo || 0; // If no steps, start with 0
    
            // Increment the step number by one
            const newStepNo = maxStepNo + 1;
    
            // Ensure parameters are not undefined
            const safeUserId = userId !== undefined ? userId : null;
            const safeCreatedBy = createdBy !== undefined ? createdBy : null;
    
            // Insert the new step with the calculated step number
            const [result] = await db.execute(sql, [flowId, newStepNo, statusName, declaration, safeUserId, safeCreatedBy]);
    
            // Return the new step details
            return { flowId, stepNo: newStepNo, statusName, declaration, userId: safeUserId };
        } catch (err) {
            console.error('Error executing addFlowStep SQL: ', err);
            throw err; // Ensure error is thrown to be caught by the service layer
        }
    }
}

