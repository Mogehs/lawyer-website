import { customError } from "./customError.js"

export const allowedRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) throw new customError('Unauthorized', 401)
        if (!roles.includes(req.user.role)) {
            throw new customError('Access denied: insufficient role');
        }
        next();
    }
}