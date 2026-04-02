// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware for role-based access control
const checkRole = (roles) => {
    return (req, res, next) => {
        // If user role is not in the allowed list
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: role not authorized' });
        }
        next();
    };
};

module.exports = { auth, checkRole };
