import PartsService from "../../../services/Parts_module/Parts/parts_service.js";
import { validatePartsData,validateUpdatePartsData } from "../../../middlewares/Parts_module/Parts/parts_validation.js";

export default class PartsController {
    static async createPartsController(req, res) {
        const partsData = req.body; // Collect data from request body
        try {
            validatePartsData(partsData);
            const newPartId = await PartsService.createPartsService(partsData);
            res.status(201).json({ status: 'success', message: 'Parts created successfully', partId: newPartId });
        } catch (err) {
            console.error('Error in createPartsController: ', err);
            res.status(500).json({ status: 'failed', message: err.message });
        }
    }

    static async getPartsController(req, res) {
        try {
            const parts = await PartsService.getAllPartsService();
            res.json({ status: 'success', data: parts });
        } catch (err) {
            console.error('Error in getPartsController: ', err);
            res.status(500).json({ status: 'failed', message: err.message });
        }
    }

    static async getPartsByIdController(req, res) {
        const { partId } = req.params;
        try {
            const part = await PartsService.getPartByIdService(partId);
            if (!part) {
                return res.status(404).json({ status: 'failed', message: 'Part not found' });
            }
            res.json({ status: 'success', data: part });
        } catch (err) {
            console.error('Error in getPartsByIdController: ', err);
            res.status(500).json({ status: 'failed', message: err.message });
        }
    }

    static async updatePartsController(req, res) {
        const { partId } = req.params;
        const partsData = req.body;
        try {
            validateUpdatePartsData(partsData);
            await PartsService.updatePartService(partId, partsData);
            res.json({ status: 'success', message: 'Parts updated successfully' });
        } catch (err) {
            console.error('Error in updatePartsController: ', err);
            res.status(500).json({ status: 'failed', message: err.message });
        }
    }

    static async deletePartsController(req, res) {
        const { partId } = req.params;
        try {
            await PartsService.deletePartService(partId);
            res.json({ status: 'success', message: 'Parts deleted successfully' });
        } catch (err) {
            console.error('Error in deletePartsController: ', err);
            res.status(500).json({ status: 'failed', message: err.message });
        }
    }
}
