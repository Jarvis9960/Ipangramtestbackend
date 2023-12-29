import UserModel from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field properly",
      });
    }

    const emailExist = await UserModel.findOne({
      Email: email,
    });

    if (!emailExist) {
      return res.status(422).json({
        status: false,
        message: "Email is not registered to organization",
      });
    }

    const comparePass = await bcrypt.compareSync(password, emailExist.Password);

   

    if (email === emailExist.Email && comparePass) {
      const payload = {
        _id: emailExist._id,
        role: emailExist.Role,
      };
      const token = await jwt.sign(payload, process.env.JWTSECREAT, {
        expiresIn: 86400,
      });

      res.cookie("token", token, { httpOnly: true });

      res
        .status(201)
        .json({ status: true, message: "Login successfully", token: token });
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid Auth: Wrong email or password",
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token by setting an expired cookie
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.status(201).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
   
    return res
      .status(500)
      .json({ status: false, message: "Failed to logout", err: error });
  }
};
