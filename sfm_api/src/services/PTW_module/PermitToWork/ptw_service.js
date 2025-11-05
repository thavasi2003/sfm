import PermitToWorkDao from "../../../dao/PTW_module/PermitToWork/ptw_dao.js";

export default class PermitToWorkService {
  static async getAllPermitToWork() {
    try {
      const permitToWork = await PermitToWorkDao.getAllPermitToWork();
      return permitToWork;
    } catch (err) {
      console.error("Error in getAllPermitToWorkService: ", err);
    }
  }

  static async getPermitToWorkByIdService(appId) {
    try {
      const permitToWork = await PermitToWorkDao.getPermitToWorkById(appId);
      return permitToWork;
    } catch (err) {
      console.error("Error in getPermitToWorkByIdService: ", err);
      throw err;
    }
  }

  static async getPermitTypeByIdService(ptId) {
    try {
      const permitType = await PermitToWorkDao.getPermitTypeById(ptId);
      return permitType;
    } catch (err) {
      console.error("Error in getPermitTypeByIdService: ", err);
    }
  }

  static async getPermitTypeNameService() {
    try {
      const permitTypeName = await PermitToWorkDao.getPermitTypeName();
      return permitTypeName;
    } catch (err) {
      console.error("Error in getPermitTypeNameService: ", err);
    }
  }
  static async addMultipleChecklistResponsesService(payload) {
    try {
      const {
        ptId,
        activeStatus,
        createdBy,
        responses,
        statusName,
        signOffRemarks,
        userId,
        signature,
        processedAt,
      } = payload;
      await PermitToWorkDao.addMultipleChecklistResponses(
        ptId,
        activeStatus,
        createdBy,
        responses,
        statusName,
        signOffRemarks,
        userId,
        signature,
        processedAt
      );
    } catch (err) {
      console.error("Error in addMultipleChecklistResponsesService: ", err);
      throw err;
    }
  }

  static async getSignOffService(appId) {
    try {
      const signOff = await PermitToWorkDao.getSignOff(appId);
      return signOff;
    } catch (err) {
      console.error("Error in getSignOffService: ", err);
    }
  }

  static async addSignOffService(
    appId,
    statusName,
    signOffRemarks,
    userId,
    signature
  ) {
    try {
      const response = await PermitToWorkDao.addSignOff(
        appId,
        statusName,
        signOffRemarks,
        userId,
        signature
      );
      return response;
    } catch (err) {
      console.error("Error in addSignOffService: ", err);
    }
  }

  static async getChecklistResponseService(appId) {
    try {
      const checklistResponse = await PermitToWorkDao.getChecklistResponse(
        appId
      );
      return checklistResponse;
    } catch (err) {
      console.error("Error in getChecklistResponseService: ", err);
    }
  }

  static async getSignOffHistoryService(appId) {
    try {
      const signOffHistory = await PermitToWorkDao.getSignOffHistory(appId);
      return signOffHistory;
    } catch (err) {
      console.error("Error in getSignOffHistoryService: ", err);
    }
  }

  static async deletePermitToWorkService(appId) {
    try {
      await PermitToWorkDao.deletePermitToWork(appId);
    } catch (err) {
      console.error("Error in deletePermitToWorkService: ", err);
    }
  }

  static async updateAssignmentService(flowId, stepNo, userId, updatedBy) {
    try {
      await PermitToWorkDao.updateAssignment(flowId, stepNo, userId, updatedBy);
    } catch (err) {
      console.error("Error in updateAssignmentService: ", err);
    }
  }

  static async cancelPermitToWorkService(
    appId,
    workStatus,
    appStatus,
    statusName,
    userId,
    updatedBy
  ) {
    try {
      // First update the permit status
      await PermitToWorkDao.updatePermitStatus(
        appId,
        workStatus,
        appStatus,
        updatedBy
      );

      // Then insert the sign off entry
      await PermitToWorkDao.insertAppSignOff(appId, statusName, userId);

      return true;
    } catch (err) {
      console.error("Error in cancelPermitToWorkService: ", err);
    }
  }

  static async restartAppFlowService(
    appId,
    statusName,
    userId,
    signOffRemarks
  ) {
    try {
      // First, insert into app_sign_off
      await PermitToWorkDao.requestChange(
        appId,
        statusName,
        userId,
        signOffRemarks
      );

      // Then, update m_permit_to_work
      await PermitToWorkDao.restartAppFlow(appId);

      return {
        success: true,
        message: "Application flow restarted successfully.",
      };
    } catch (err) {
      console.error("Error processing application restart: ", err);
    }
  }

  static async updateChecklistResponseService(
    appId,
    serialNo,
    checkOptions,
    remarks,
    updatedBy
  ) {
    try {
      // Update checklist responses
      await PermitToWorkDao.updateChecklistResponse(
        appId,
        serialNo,
        checkOptions,
        remarks,
        updatedBy
      );
    } catch (err) {
      console.error("Error in updateChecklistResponseService: ", err);
    }
  }
  static async updateAppStatusService(appId, appStatus, updatedBy) {
    try {
      await PermitToWorkDao.updateAppStatus(appId, appStatus, updatedBy);
      return true;
    } catch (err) {
      console.error("Error in updateAppStatusService: ", err);
    }
  }
  static async insertAppSignOffService(appId, statusName, userId) {
    try {
      await PermitToWorkDao.insertAppSignOff(appId, statusName, userId);
      return true;
    } catch (err) {
      console.error("Error in insertAppSignOff: ", err);
    }
  }

  static async getChecklistPdfService(appId) {
    try {
      const result = await PermitToWorkDao.getChecklistPdf(appId);
      return result;
    } catch (err) {
      console.error("Error in getChecklistPdfService: ", err);
    }
  }

  static async getSignOffPdfService(appId) {
    try {
      const result = await PermitToWorkDao.getSignOffPdf(appId);
      return result;
    } catch (err) {
      console.error("Error in getSignOffPdfService: ", err);
    }
  }
}
