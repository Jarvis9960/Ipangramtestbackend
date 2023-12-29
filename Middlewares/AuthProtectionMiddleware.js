import UserModel from "../Models/User.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      const { token } = req.cookies;

      const verifyToken = await jwt.verify(token, process.env.JWTSECREAT);

      if (verifyToken) {
        const user = await UserModel.findOne({ _id: verifyToken._id }).select(
          "-Password"
        );

        if (!user) {
          return res
            .status(401)
            .json({ status: false, message: "Invalid Auth: User not found" });
        }

        req.user = user;

        return next();
      }
    }

    res.status(401).json({ error: "Unauthorized user please login first" });
  } catch (error) {
    return res.status(401).json({ status: false, message: " Invalid Auth" });
  }
};

export const protectedRouteforManager = async (req, res, next) => {
  try {
    if (req.cookies.token) {
      const { token } = req.cookies;

      const verifyToken = await jwt.verify(token, process.env.JWTSECREAT);

      if (verifyToken.role === "Employee") {
        return res
          .status(401)
          .json({ status: false, message: "Api is only accessable to manage" });
      } else {
        const user = await UserModel.findOne({ _id: verifyToken._id }).select(
          "-Password"
        );

        if (!user) {
          return res
            .status(401)
            .json({ status: false, message: "Invalid Auth: User not found" });
        }

        req.user = user;

        return next();
      }
    }

    res.status(401).json({ error: "Unauthorized user please login first" });
  } catch (error) {
    return res.status(401).json({ status: false, message: " Invalid Auth" });
  }
};
