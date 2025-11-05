import FlowDao from "../../../dao/PTW_module/Flow/flow_dao.js";

export default class FlowService {
  static async getAllFlowNameService() {
    try {
      const flownames = await FlowDao.getAllFlowName();
      return flownames;
    } catch (err) {
      console.error("Error in getFlowNameService: ", err);
    }
  }

  static async checkFlowNameService(flowName) {
    try {
      const isUnique = await FlowDao.checkFlowName(flowName);
      return isUnique;
    } catch (err) {
      console.error("Error in checkFlowNameService: ", err);
    }
  }
  static async getFlowIndexService() {
    try {
      const flowIndex = await FlowDao.getFlowIndex();
      return flowIndex;
    } catch (err) {
      console.error("Error in getFlowIndexService: ", err);
    }
  }

  static async deleteFlowDetailsService(flowId) {
    if (!flowId) {
      throw new Error("flowId is required");
    }
    try {
      const result = await FlowDao.deleteFlowDetails(flowId);
      return result;
    } catch (err) {
      console.error("Error in deleteFlowDetailsService:", err);
    }
  }

  static async createFlowDetails(flowName, steps, createdBy) {
    // Validate parameters
    if (!flowName || !steps || !Array.isArray(steps) || steps.length === 0) {
      throw new Error("Invalid parameters: flowName and steps are required.");
    }

    try {
      // Create flow
      const flowId = await FlowDao.createFlowName(flowName, createdBy);

      // Add steps to m_flow_details
      for (let stepNo = 0; stepNo < steps.length; stepNo++) {
        const { statusName, declaration, userId } = steps[stepNo];
        if (!statusName || !declaration) {
          throw new Error(
            "Invalid parameters: All step parameters are required."
          );
        }

        await FlowDao.createFlowDetails(
          flowId,
          stepNo + 1,
          statusName,
          declaration,
          userId || null,
          createdBy
        );
      }

      return { flowId };
    } catch (error) {
      console.error("Error executing SQL: ", error);
    }
  }
  static async getFlowNameService(flowId) {
    try {
      const flowName = await FlowDao.getFlowNameById(flowId);
      return flowName;
    } catch (err) {
      console.error("Error in getFlowNameService: ", err);
      throw err;
    }
  }

  static async getFlowDetailsIndexServer(flowId) {
    try {
      const flowDetailsIndex = await FlowDao.getFlowDetailsIndex(flowId);
      return flowDetailsIndex;
    } catch (error) {
      console.error("Error in getFlowDetailsIndexServer: ", error);
      throw error;
    }
  }

  static async deleteFlowStepService(flowId, stepNo) {
    try {
      await FlowDao.deleteFlowStep(flowId, stepNo);
    } catch (error) {
      console.error("Error in deleteFlowStep: ", error);
      throw error;
    }
  }
  static async updateFlowNameService(flowName, flowId, updatedBy) {
    try {
      await FlowDao.updateFlowName(flowName, flowId, updatedBy);
    } catch (error) {
      console.error("Error in updateFlowNameService: ", error);
      throw error;
    }
  }
  static async updateFlowStepService(
    flowId,
    stepNo,
    statusName,
    declaration,
    userId,
    updatedBy
  ) {
    try {
      const result = await FlowDao.updateFlowStep(
        flowId,
        stepNo,
        statusName,
        declaration,
        userId,
        updatedBy
      );
      return result;
    } catch (error) {
      console.error("Error in updateFlowStepService: ", error);
      throw error;
    }
  }

  static async addFlowStepService(
    flowId,
    statusName,
    declaration,
    userId,
    createdBy
  ) {
    try {
      const result = await FlowDao.addFlowStep(
        flowId,
        statusName,
        declaration,
        userId,
        createdBy
      );
      return result;
    } catch (error) {
      console.error("Error in addFlowStepService: ", error);
      throw error;
    }
  }
}
