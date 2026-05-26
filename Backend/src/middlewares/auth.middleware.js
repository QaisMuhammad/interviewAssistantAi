const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklist');


async function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    const isTokenBlacklisted = await BlacklistedToken.findOne({ token }); // Implement token blacklisting logic here
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token is invalid, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

module.exports = { authUser };