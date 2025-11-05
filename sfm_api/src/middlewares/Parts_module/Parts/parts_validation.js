export function validatePartsData(partsdata) {
    const requiredFields = [
        'partname',
        'partsType',
        'quantity',
        'unitOfMeasure',
        'linkToAssetId',
        'locationZone',
        'locationSchoolId',
        'locationSchoolName',
        'locationBlock',
        'locationLevel',
        'locationRoomNo',
        'locationRoomName',
        'locQRID',
        'partsImage',
        'storeName',
        'createdBy'
    ];

    for (const field of requiredFields) {
        if (!partsdata[field] || partsdata[field] === undefined) {
            throw new Error(`${field} is required`);
        }

        switch (field) {
            case 'partname':
            case 'partsType':
            case 'locationZone':
            case 'locationSchoolName':
            case 'locationBlock':
            case 'locationLevel':
            case 'locationRoomName':
            case 'locationRoomNo':
            case 'unitOfMeasure':
            case 'locQRID':
            case 'storeName':
            case 'partsImage':
                if (typeof partsdata[field] !== 'string') {
                    throw new Error(`${field} must be a string`);
                }
                break;
            case 'linkToAssetId':
            case 'locationSchoolId':
            case 'createdBy':
                if (typeof partsdata[field] !== 'number') {
                    throw new Error(`${field} must be a number`);
                }
                break;
            case 'quantity':
                if (typeof partsdata[field] !== 'number' || partsdata[field] <= 0) {
                    throw new Error(`${field} must be a positive number`);
                }
                break;
            default:
                break;
        }
    }
}

export function validateUpdatePartsData(partsdata) {
    const updateFields = [
        'partname',
        'partsType',
        'quantity',
        'unitOfMeasure',
        'linkToAssetId',
        'locationZone',
        'locationSchoolId',
        'locationSchoolName',
        'locationBlock',
        'locationLevel',
        'locationRoomNo',
        'locationRoomName',
        'locQRID',
        'partsImage',
        'storeName',
        'updateBy'
    ];

    for (const field of updateFields) {
        if (partsdata[field] === undefined) continue;

        switch (field) {
            case 'partname':
            case 'partsType':
            case 'locationZone':
            case 'locationSchoolName':
            case 'locationBlock':
            case 'locationLevel':
            case 'locationRoomName':
            case 'locationRoomNo':
            case 'unitOfMeasure':
            case 'locQRID':
            case 'storeName':
            case 'partsImage':
                if (typeof partsdata[field] !== 'string') {
                    throw new Error(`${field} must be a string`);
                }
                break;
            case 'linkToAssetId':
            case 'locationSchoolId':
            case 'updateBy':
                if (typeof partsdata[field] !== 'number') {
                    throw new Error(`${field} must be a number`);
                }
                break;
            case 'quantity':
                if (typeof partsdata[field] !== 'number' || partsdata[field] <= 0) {
                    throw new Error(`${field} must be a positive number`);
                }
                break;
            default:
                break;
        }
    }
}
