"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        req.user = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
exports.default = authMiddleware;
