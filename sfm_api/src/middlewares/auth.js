import jwt from 'jsonwebtoken';

export default function authenticateToken(req, res, next) {
    // Extract the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        console.error('Error verifying token: ', ex);
        res.status(400).json({ error: 'Invalid token.' });
    }
}
