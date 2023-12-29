import express from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartmentForDropDown,
  getSingleDepartMent,
  updateDepartment,
} from "../Controllers/DepartmentController.js";
const router = express.Router();
import { protectedRouteforManager } from "../Middlewares/AuthProtectionMiddleware.js";

router.post("/createdepartment", protectedRouteforManager, createDepartment);
router.get("/getdepartment", protectedRouteforManager, getDepartment);
router.get(
  "/getdepartmentdropdowndata",
  protectedRouteforManager,
  getDepartmentForDropDown
);
router.get(
  "/getsingledepartment",
  protectedRouteforManager,
  getSingleDepartMent
);
router.put("/updatedepartment", protectedRouteforManager, updateDepartment);
router.delete("/deletedepartment", protectedRouteforManager, deleteDepartment);

export default router;
