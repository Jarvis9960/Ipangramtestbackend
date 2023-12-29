import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  DepartmentName: {
    type: String,
    required: true,
    unique: true,
  },
  totalEmployee: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: "Total employee count must be an integer",
    },
    min: [0, "Total employee count cannot be negative"],
  },
});

const DepartmentModel = mongoose.model("Department", departmentSchema)

export default DepartmentModel;
