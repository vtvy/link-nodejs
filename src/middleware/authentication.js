const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const verifyToken = (req, res, next) => {
    const headerToken = req.header("authorization");
    if (!headerToken) return next(new ApiError(403, "Invalid authentication"));
    try {
        const token = headerToken.substring(7);
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN_CODE);
        req.body.author = decoded.id;
        req.body.role = decoded.role;
        next();
    } catch (error) {
        return next(new ApiError(403, "Invalid authentication"));
    }
};

const verifyAdminToken = (req, res, next) => {
    const headerToken = req.header("authorization");
    if (!headerToken) return next(new ApiError(403, "Invalid authentication"));
    try {
        const token = headerToken.substring(7);
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN_CODE);
        if (decoded.id !== 1 || !decoded.role)
            return next(new ApiError(403, "Invalid authentication"));
        req.body.author = decoded.id;
        req.body.role = decoded.role;
        next();
    } catch (error) {
        return next(new ApiError(403, "Invalid authentication"));
    }
};

module.exports = { verifyToken, verifyAdminToken };
