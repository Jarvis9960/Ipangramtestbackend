import express from "express";
const router = express.Router();
import {
  createManageSignUp,
  deleteManager,
  getFilteredManager,
  getSingleManager,
  updateManager,
} from "../Controllers/ManagerController.js";
import { validateSignUpInput } from "../Middlewares/ManagerMiddleware.js";
import { protectedRouteforManager } from "../Middlewares//AuthProtectionMiddleware.js";

router.post(
  "/createmanager",
  protectedRouteforManager,
  validateSignUpInput,
  createManageSignUp
);
router.get("/getmanagers", protectedRouteforManager, getFilteredManager);
router.get("/getsinglemanager", protectedRouteforManager, getSingleManager);
router.put("/updatemanager", protectedRouteforManager, updateManager);
router.delete("/deletemanager", protectedRouteforManager, deleteManager);

export default router;
