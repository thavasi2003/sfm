function handleError(res,error){
    if (res.headersSent) {
        return;
    }
    const statusCode=error.statusCode || 500;
    const errorMessage=error.Message || 'Internal Server Error';
    console.error('Error: ', errorMessage, 'Stack: ', error.stack);
    res.status(statusCode).json({error: errorMessage});
};

export default handleError;

export const handleDuplicateNameError = (res, error) => {
    res.status(409).json({ error: error.message });
};
