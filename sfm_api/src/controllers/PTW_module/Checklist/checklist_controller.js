import ChecklistService from "../../../services/PTW_module/Checklist/checklist_service.js";
import handleError from "../../../utils/pt_utils.js";

export default class ChecklistController{
 static async getChecklistNameController(req, res) {
    try {
        const checklistNames = await ChecklistService.getChecklistNameService();
        res.json(checklistNames);
    } catch (err) {
        handleError(res, err);
        res.json({ status: 'failed' });
    }
 }
}


