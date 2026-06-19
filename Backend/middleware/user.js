import jwt from 'jsonwebtoken'
import User from '../models/user.js';
  
export const authenticate = async (req, res,next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
        console.log(token)
        console.log("HEADERS:", req.headers.authorization);
console.log("COOKIES:", req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const adminauth = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "access denied",
    });
  }
};

export const sellerauth = (req, res, next) => {
  if (req.user?.role === "seller") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "access denied for seller",
    });
  }
};