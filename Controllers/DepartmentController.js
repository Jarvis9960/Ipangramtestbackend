import DepartmentModel from "../Models/Department.js";

export const createDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;

    if (!departmentName) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide department name" });
    }

    const departmentExist = await DepartmentModel.findOne({
      DepartmentName: departmentName,
    });

    if (departmentExist) {
      return res
        .status(422)
        .json({ status: false, message: "Department already exists" });
    }

    const newDepartment = new DepartmentModel({
      DepartmentName: departmentName,
    });

    const saveDepartment = await newDepartment.save();

    if (saveDepartment) {
      return res
        .status(201)
        .json({ status: true, message: "Department succesfully created" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const getDepartment = async (req, res) => {
  try {
    let { sort } = req.query;
    const page = req.query.page || 1;
    const limit = 9;

    sort = sort === "asending" ? 1 : -1;

    const totalCount = await DepartmentModel.find().countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    const savedDepartment = await DepartmentModel.find()
      .sort({ DepartmentName: sort })
      .skip((page - 1) * limit)
      .limit(limit);

    if (savedDepartment.length < 1) {
      return res
        .status(404)
        .json({ status: false, message: "No data found in the database" });
    }

    return res.status(200).json({
      status: true,
      message: "Data successfully fetched",
      savedDepartment,
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

export const getSingleDepartMent = async (req, res) => {
  try {
    const { departmentId } = req.query;

    if (!departmentId) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide department id" });
    }

    const findDepartment = await DepartmentModel.findOne({ _id: departmentId });

    if (!findDepartment) {
      return res
        .status(422)
        .json({ status: false, message: "no such department data present" });
    }

    return res.status(201).json({
      status: true,
      message: "Department data successfully fetched",
      department: findDepartment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const getDepartmentForDropDown = async (req, res) => {
  try {
    const savedDepartment = await DepartmentModel.find();

    if (savedDepartment.length < 1) {
      return res
        .status(422)
        .json({ status: false, message: "No department data is present " });
    }

    return res.status(201).json({
      status: true,
      message: "successfully fetched department data",
      departments: savedDepartment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { departmentId, departmentName } = req.body;

    if (!departmentName) {
      return res
        .status(422)
        .json({ status: false, message: "Please provide department name" });
    }

    const departmentExist = await DepartmentModel.findOne({
      DepartmentName: departmentName,
    });

    if (departmentExist) {
      return res
        .status(422)
        .json({ status: false, message: "Department already exists" });
    }

    const updateDepartment = await DepartmentModel.updateOne(
      { _id: departmentId },
      { $set: { DepartmentName: departmentName } }
    );

    if (updateDepartment.acknowledged) {
      return res
        .status(201)
        .json({ status: true, message: "Department updated successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.query;

    if (!departmentId) {
      return res
        .status(422)
        .json({
          status: false,
          message: "Please provide delete id to delete department",
        });
    }

    const deleteResponse = await DepartmentModel.deleteOne({
      _id: departmentId,
    });

    if (deleteResponse.acknowledged) {
      return res
        .status(201)
        .json({ status: true, message: "Department deleted" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};
