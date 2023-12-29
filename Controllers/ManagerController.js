import UserModel from "../Models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import dotenv from "dotenv";

const fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(fileName);

dotenv.config({ path: path.resolve(__dirName, "../config.env") });

function generateRandomPassword() {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

export const createManageSignUp = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      gender,
      location,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !gender ||
      !location
    ) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field",
      });
    }

    const emailExist = await UserModel.findOne({ Email: email });

    if (emailExist) {
      return res.status(422).json({
        status: false,
        message: "Email already exist with existing manager",
      });
    }

    const phoneExist = await UserModel.findOne({
      MobileNumber: mobileNumber,
    });

    if (phoneExist) {
      return res.status(422).json({
        status: false,
        message: "Mobile number already exists with existing manager",
      });
    }

    const generateRandomPass = generateRandomPassword();

    const hashPassword = await bcrypt.hashSync(generateRandomPass, 10);

    const newManager = new UserModel({
      FirstName: firstName,
      MiddleName: middleName,
      LastName: lastName,
      Email: email,
      MobileNumber: mobileNumber,
      Gender: gender,
      Location: location,
      Password: hashPassword,
      Role: "Manager",
    });

    const saveManger = await newManager.save();

    if (saveManger) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.NODEMAILERUSER,
          pass: process.env.NODEMAILERPASS,
        },
      });

      let info = await transporter.sendMail({
        from: "", // sender address
        to: email, // list of receivers
        subject: "Account creation", // Subject line
        // text: "", // plain text body
        html: `
        Dear ${firstName},\n\nYou have been successfully added as a contractor. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${generateRandomPass}\n\nPlease use these credentials to log in to our platform.\n\nBest regards,\nThe Admin Team
            `, // html body
      });

      if (info.accepted[0] === email) {
        console.log("Email sent to successfully login user");
        return res.status(201).json({
          status: true,
          message:
            "Manager account credential has successfully mailed to email",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong", err: error });
  }
};

export const getFilteredManager = async (req, res) => {
  try {
    const { queryField, sort } = req.query;
    const page = req.query.page || 1;
    const limit = 9;
    let filterConditions = {};

    // Add additional filtering conditions based on query parameters
    if (queryField && sort) {
      filterConditions[queryField] = sort === "asending" ? 1 : -1;
    }

    const totalCount = await UserModel.find({ Role: "Manager" }).countDocuments(
      {}
    );
    const totalPages = Math.ceil(totalCount / limit);

    const savedManager = await UserModel.find({ Role: "Manager" })
      .sort(filterConditions)
      .skip((page - 1) * limit)
      .limit(limit);

    if (savedManager.length < 1) {
      return res
        .status(404)
        .json({ status: false, message: "No data found in the database" });
    }

    return res.status(200).json({
      status: true,
      message: "Data successfully fetched",
      savedManager,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong", error: error });
  }
};

export const getSingleManager = async (req, res) => {
  try {
    const { managerId } = req.query;

    if (!managerId) {
      return res.status(422).json({
        status: false,
        message: "Please provide managerId for query",
      });
    }

    const findManager = await UserModel.findOne({ _id: managerId });

    if (!findManager) {
      return res.status(422).json({
        status: false,
        message: "No such Employee data is present or invalid id",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Successfully fetched single Employee data",
      Manager: findManager,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const updateManager = async (req, res) => {
  try {
    const {
      managerId,
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      gender,
      location,
    } = req.body;

    if (
      !managerId ||
      !firstName ||
      !lastName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !gender ||
      !location
    ) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the required field",
      });
    }

    const emailExist = await UserModel.findOne({
      _id: { $ne: managerId },
      Email: email,
    });

    if (emailExist) {
      return res.status(422).json({
        status: false,
        message: "Email already exists",
      });
    }

    const phoneExist = await UserModel.findOne({
      _id: { $ne: managerId },
      MobileNumber: mobileNumber,
    });

    if (phoneExist) {
      return res.status(422).json({
        status: false,
        message: "Mobile number already exists.",
      });
    }

    const saveManger = await UserModel.updateOne(
      { _id: managerId },
      {
        $set: {
          FirstName: firstName,
          MiddleName: middleName,
          LastName: lastName,
          Email: email,
          MobileNumber: mobileNumber,
          Location: location,
          Gender: gender,
        },
      }
    );

    if (saveManger) {
      return res
        .status(201)
        .json({ status: true, message: "manager successfully updated" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong", err: error });
  }
};

export const deleteManager = async (req, res) => {
  try {
    const { managerId } = req.query;

    if (!managerId) {
      return res.status(422).json({
        status: false,
        message: "Please provide delete id to delete department",
      });
    }

    const deleteResponse = await UserModel.deleteOne({
      _id: managerId,
    });

    if (deleteResponse.acknowledged) {
      return res.status(201).json({ status: true, message: "Manager deleted" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};
