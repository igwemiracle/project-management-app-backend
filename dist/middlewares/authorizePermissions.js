"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = void 0;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Not authorized to access this route" });
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
//# sourceMappingURL=authorizePermissions.js.map