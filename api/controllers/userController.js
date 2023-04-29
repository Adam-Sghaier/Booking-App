import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { updateUserValidator } from "../utils/validator.js";

// the callback function should be async because there some functions that should execute before it so they takes time(the db connection + the collection and document creation)

export const updateUser = async (req, res, next) => {
  try {
    // updating the User info
    // the findByIdAndUpadate method take as parameters,the id taken from the request and the mongodb $set function , and finally the new parameter that allows us to get the updated version of the document
    if (!req.body.img) {
      const { error } = updateUserValidator(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
    }

    let body = req.body;
    if (req.body.password) {
      const { password, ...otherInfos } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      body = { password: hash, ...otherInfos };

    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true }
    );
    // if saved , the User returned in json format
    return res.status(200).json("User Successfully Updated");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // if saved , the User returned in json format
    return res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {

  try {

    const user = await User.findById(req.params.id);


    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ isAdmin: true });
    const {_id,...otherInfos} = user._doc;
    return res.status(200).json(otherInfos);
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
