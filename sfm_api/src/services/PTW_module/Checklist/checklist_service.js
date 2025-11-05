import ChecklistDao from "../../../dao/PTW_module/Checklist/checklist_dao.js";

export default class ChecklistService {
  static async getChecklistNameService() {
    try {
      const checklistNames = await ChecklistDao.getChecklistNameDao();
      return checklistNames;
    } catch (err) {
      console.error("Error in getChecklistNameService: ", err);
    }
  }
}
