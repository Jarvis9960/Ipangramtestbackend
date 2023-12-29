import { check } from "express-validator";

export const validateSignUpInput = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("mobileNumber").isMobilePhone().withMessage("Invalid mobile number"),
  check("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
];
