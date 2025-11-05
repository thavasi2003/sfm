import PartsDao from "../../../dao/Parts_module/Parts/parts_dao.js";

export default class PartsService {
    static async createPartsService(partsData) {
        try {
            const newPartId = await PartsDao.createPartsDao(partsData);
            return newPartId;
        } catch (err) {
            console.error('Error in createPartsService: ', err);
        }
    }

    static async getAllPartsService() {
        try {
            const allParts = await PartsDao.getAllPartsDao();
            return allParts;
        } catch (err) {
            console.error('Error in getAllPartsService: ', err);
        }
    }

    static async getPartByIdService(partId) {
        try {
            const part = await PartsDao.getPartsByIdDao(partId);
            return part;
        } catch (err) {
            console.error('Error in getPartByIdService: ', err);
        }
    }

    static async updatePartService(partId, partsData) {
        try {
            await PartsDao.updatePartsDao(partsData, partId);
        } catch (err) {
            console.error('Error in updatePartService: ', err);
        }
    }

    static async deletePartService(partId) {
        try {
            await PartsDao.deletePartsDao(partId);
        } catch (err) {
            console.error('Error in deletePartService: ', err);
        }
    }
}
