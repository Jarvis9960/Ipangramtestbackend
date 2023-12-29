import { check } from "express-validator";

export const validateSignInInput = [
  check("email").isEmail().withMessage("Invalid email address"),
];
