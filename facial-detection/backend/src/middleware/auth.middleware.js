const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function authUser(req, res, next) {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const isTokenBlacklisted = await redis.get(token);
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(decodedToken.id).select("-password");

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
}

module.exports = { authUser };