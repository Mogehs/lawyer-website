import jwt from "jsonwebtoken";

/**
 * Generate jwt Token
 * @param {object} payload - user data
 * @returns {string} token
 */

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || "shakeeldev", {
        expiresIn: "7d"
    })
}

/**
 * Verify Token
 * @param {string} token
 * @returns {Object|null} decode data or null if invalid
 */

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null
    }
}