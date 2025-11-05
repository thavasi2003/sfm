
export function validatePermitType(data) {
    const { ptName, checklistId, flowId, reqId, remarks, active, createdBy } = data;

    if (!ptName || typeof ptName !== 'string' || ptName.trim().length === 0) {
        throw new Error('Invalid Permit Type Name');
    }
    if (typeof checklistId !== 'number' || checklistId < 0) {
        throw new Error('Invalid Checklist ID');
    }
    if (typeof flowId !== 'number' || flowId < 0) {
        throw new Error('Invalid Flow ID');
    }
    if (typeof reqId !== 'number' || reqId < 0) {
        throw new Error('Invalid ReqTag ID');
    }
    if (!remarks || typeof remarks !== 'string') {
        throw new Error('Invalid Remarks');
    }
    if (!active || typeof active !== 'string') {
        throw new Error('Invalid Active status');
    }
    if (typeof createdBy !== 'number' || createdBy < 0) {
        throw new Error('Invalid CreatedBy');
    }
}

export  function validateUpdatePermitType(data) {
    const { ptName, checklistId, flowId, reqId, remarks, active,updatedBy } = data;

    if (!ptName || typeof ptName !== 'string') {
        throw new Error('Invalid Permit Type Name');
    }
    if (typeof checklistId !== 'number' || checklistId < 0) {
        throw new Error('Invalid Checklist ID');
    }
    if (typeof flowId !== 'number' || flowId < 0) {
        throw new Error('Invalid Flow ID');
    }
    if (typeof reqId !== 'number' || reqId < 0) {
        throw new Error('Invalid ReqTag ID');
    }
    if (!remarks || typeof remarks !== 'string') {
        throw new Error('Invalid Remarks');
    }
    if (!active || typeof active !== 'string') {
        throw new Error('Invalid Active status');
    }
    if(!updatedBy || typeof updatedBy !== 'number' || updatedBy < 0) {
        throw new Error('Invalid UpdatedBy');
    }
}
