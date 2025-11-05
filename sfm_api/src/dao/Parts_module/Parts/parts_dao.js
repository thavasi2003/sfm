import db from "../../../config/db_config.js";

export default class PartsDao {
  static async createPartsDao(partsData) {
    const sql = `INSERT INTO parts(partname, partsType, quantity, unitOfMeasure, linkToAssetId, locationZone, locationSchoolId,
                        locationSchoolName, locationBlock, locationLevel, locationRoomNo, locationRoomName, locQRID, partsImage,
                        storeName, createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    try {
      const partsDataArray = [
        partsData.partname,
        partsData.partsType,
        partsData.quantity,
        partsData.unitOfMeasure,
        partsData.linkToAssetId,
        partsData.locationZone,
        partsData.locationSchoolId,
        partsData.locationSchoolName,
        partsData.locationBlock,
        partsData.locationLevel,
        partsData.locationRoomNo,
        partsData.locationRoomName,
        partsData.locQRID,
        partsData.partsImage,
        partsData.storeName,
        partsData.createdBy,
      ];

      const [result] = await db.execute(sql, partsDataArray);
      console.log(JSON.stringify(result));
      return result.insertId;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err; // Re-throw the error after logging it
    }
  }

  static async getAllPartsDao() {
    const sql = `SELECT parts.partId, parts.partname, parts.partsType, parts.quantity, parts.unitOfMeasure, 
                     parts.linkToAssetId, parts.locationZone, parts.locationSchoolId,parts.locationSchoolName, 
                     parts.locationBlock, parts.locationLevel, parts.locationRoomNo, parts.locationRoomName, 
                     parts.locQRID, parts.partsImage,parts.storeName,
                     DATE_FORMAT(parts.createdOn, '%d/%m/%Y %h:%i %p') AS createdOn, 
                     parts.createdBy,
                     DATE_FORMAT(parts.lastUpdate, '%d/%m/%Y %h:%i %p') AS lastUpdate, 
                     parts.updateBy, 
                     acc.displayName as creatorName, 
                     acc1.displayName as updatorName
                    FROM parts
                    LEFT JOIN account acc ON parts.createdBy = acc.userId 
                    LEFT JOIN account acc1 ON parts.updateBy = acc1.userId
                    ORDER BY parts.partId ASC`;
    try {
      const [rows] = await db.execute(sql);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async getPartsByIdDao(partId) {
    const sql = "SELECT * FROM parts WHERE partId =?";
    try {
      const [rows] = await db.execute(sql, [partId]);
      return rows;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }

  static async updatePartsDao(partsData, partId) {
    const sql = `UPDATE parts SET partname =?, partsType =?, quantity =?, unitOfMeasure =?, 
                        linkToAssetId =?, locationZone =?, locationSchoolId =?,
                        locationSchoolName =?, locationBlock =?, locationLevel =?, 
                        locationRoomNo =?, locationRoomName =?, locQRID =?, partsImage =?,
                        storeName =?, updateBy =? WHERE partId =?`;
    try {
      const partsDataArray = [
        partsData.partname,
        partsData.partsType,
        partsData.quantity,
        partsData.unitOfMeasure,
        partsData.linkToAssetId,
        partsData.locationZone,
        partsData.locationSchoolId,
        partsData.locationSchoolName,
        partsData.locationBlock,
        partsData.locationLevel,
        partsData.locationRoomNo,
        partsData.locationRoomName,
        partsData.locQRID,
        partsData.partsImage,
        partsData.storeName,
        partsData.updateBy,
        partId,
      ];

      await db.execute(sql, partsDataArray);
      return true;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }
  static async deletePartsDao(partId) {
    const sql = "DELETE FROM parts WHERE partId =?";
    try {
      await db.execute(sql, [partId]);
      return true;
    } catch (err) {
      console.error("Error executing SQL: ", err);
      throw err;
    }
  }
}
