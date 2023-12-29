import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getFilteredEmployees,
  getSingleEmployee,
  updateEmployee,
} from "../Controllers/EmployeeController.js";
import { validateSignUpInput } from "../Middlewares/EmployeeMiddleware.js";
import { protectedRouteforManager } from "../Middlewares/AuthProtectionMiddleware.js";

const router = express.Router();

router.post(
  "/createEmployee",
  protectedRouteforManager,
  validateSignUpInput,
  createEmployee
);
router.get("/getemployees", protectedRouteforManager, getFilteredEmployees);
router.get("/getsingleemployee", protectedRouteforManager, getSingleEmployee);
router.put("/updateemployee", protectedRouteforManager, updateEmployee);
router.delete("/deleteEmployee", protectedRouteforManager, deleteEmployee);

export default router;
