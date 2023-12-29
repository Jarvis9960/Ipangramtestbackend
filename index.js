import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import connectDb from "./Database/ConnectDb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import ManagerRoute from "./Routes/ManagerRoute.js";
import AuthRoute from "./Routes/AuthRoute.js";
import EmployeeRoute from "./Routes/EmployeeRoute.js";
import jwt from "jsonwebtoken";
import UserModel from "./Models/User.js";
import DepartmentRoute from "./Routes/DepartmentRoute.js";
import { protectedRoute } from "./Middlewares/AuthProtectionMiddleware.js";

const fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(fileName);

const app = express();

dotenv.config({ path: path.resolve(__dirName, "./config.env") });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/v1/api", ManagerRoute);
app.use("/v1/api", AuthRoute);
app.use("/v1/api", EmployeeRoute);
app.use("/v1/api", DepartmentRoute);

connectDb()
  .then((result) => {
    console.log("connection to database is succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth/check", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Auth: Token unavailable" });
    }

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

      return res.status(201).json({
        status: true,
        message: "Auth Successfull",
        IsAuth: true,
        user: user,
      });
    }
  } catch (error) {

    return res.status(500).json({
      status: false,
      message: "something went wrong: Invalid Auth",
      err: error,
    });
  }
});

app.get("/v1/api/getprofile", protectedRoute, (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Auth: user not present" });
    }

    return res
      .status(201)
      .json({
        status: true,
        message: "succesfully fetched profile",
        profile: user,
      });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "something went wrong: Invalid auth" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listing to port ${process.env.PORT}`);
});
