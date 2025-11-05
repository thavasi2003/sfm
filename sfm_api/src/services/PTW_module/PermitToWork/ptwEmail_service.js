import PermitToWorkEmailDao from "../../../dao/PTW_module/PermitToWork/ptwEmail_dao.js";

export default class PermitToWorkEmailService {
  static async getPermitTypeByIdService(ptId) {
    try {
      const permitType = await PermitToWorkEmailDao.getPermitTypeById(ptId);
      return permitType;
    } catch (err) {
      console.error("Error in getPermitTypeByIdService: ", err);
    }
  }

  static async addMultipleChecklistResponsesService(payload) {
    try {
      const {
        token,
        ptId,
        activeStatus,
        email,
        responses,
        statusName,
        signOffRemarks,
        signature,
        processedAt,
      } = payload;
      const response = await PermitToWorkEmailDao.addMultipleChecklistResponses(
        token,
        ptId,
        activeStatus,
        email,
        responses,
        statusName,
        signOffRemarks,
        signature,
        processedAt
      );
      return response;
    } catch (err) {
      console.error("Error in addMultipleChecklistResponsesService: ", err);
      throw err;
    }
  }

  static async restartAppFlowService(appId, statusName, signOffRemarks) {
    try {
      // First, insert into app_sign_off
      await PermitToWorkEmailDao.requestChange(
        appId,
        statusName,
        signOffRemarks
      );

      // Then, update m_permit_to_work
      await PermitToWorkEmailDao.restartAppFlow(appId);

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
    remarks
  ) {
    try {
      // Update checklist responses
      await PermitToWorkEmailDao.updateChecklistResponse(
        appId,
        serialNo,
        checkOptions,
        remarks
      );
    } catch (err) {
      console.error("Error in updateChecklistResponseService: ", err);
    }
  }
  static async updateAppStatusService(appId) {
    try {
      const response = await PermitToWorkEmailDao.updateAppStatus(appId);
      return response;
    } catch (err) {
      console.error("Error in updateAppStatusService: ", err);
    }
  }
  static async insertAppSignOffService(appId, statusName, email) {
    try {
      await PermitToWorkEmailDao.insertAppSignOff(appId, statusName, email);
      return true;
    } catch (err) {
      console.error("Error in insertAppSignOff: ", err);
    }
  }
}
