import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  MiddleName: {
    type: String,
    trim: true,
  },
  LastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  MobileNumber: {
    type: Number,
    required: [true, "Mobile number is required"],
    unique: true,
    trim: true,
  },
  Gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"],
  },
  Location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
  },
  Role: {
    type: String,
    default: "Employee",
  },
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
