import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { loginValidator, createUserValidator } from "../utils/validator.js";
import Token from "../models/Token.js";
import { sendVerification } from "../utils/email.js";
import crypto from "crypto";
import {
  authenticateGoogle,
  deleteFile,
  deleteUploaded,
  uploadToGoogleDrive,
} from "../utils/googleDriveService.js";

export const register = async (req, res, next) => {
  try {

    const { error } = createUserValidator(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    let user = await User.findOne({ username: newUser.username });

    if (user && user.email === newUser.email) {
      return next(createError(404, "Username & Email Exists!"));
    } else if (user) {
      return next(createError(404, "Username Exists!"));
    } else {
      user = await User.findOne({ email: newUser.email });
      if (user) return next(createError(404, "Email Exists!"));
    }
    user = await newUser.save();


    // create token that we gonna verify it later
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    // creating the url that we gonna verify it
    // const url = `${process.env.BASE_URL}users/verify/${user.verificationCode}`;
    const url = `${process.env.BASE_URL_C}users/verify/${user.id}/${token.token}`;
    await sendVerification(
      user.email,
      "Booking.tn Verify Email",
      `<div><h1>Confirmation Email</h1>
    <h2>Hello</h2>
    <p>To activate your account , click the link below </p>
    <a href=${url}>Click Here</a>
    </div>`
    );

    return res.status(200).json({
      user: "An Email sent to your account please verify",
      admin: "An Email sent to user account in order to confirm",
      id:user._id
    });
  } catch (error) {
    next(error);
    // or res.status(500).send({message:"Internal Server Error"})
  }
};

export const verifyLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid Link(ID)" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ message: "Invalid Link (token)" });
    }

    await User.findByIdAndUpdate(user._id, { $set: { verified: true } });

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginValidator(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    // the find one method returns one document
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) return next(createError(400, "Wrong password!"));
    let token1 = await Token.findOne({ userId: user._id });
    if (!user.verified) {
      if (!token1) {
        token1 = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        // creating the url that we gonna verify it
        const url = `${process.env.BASE_URL_C}users/verify/${user._id}/${token1.token}`;
        await sendVerification(
          user.email,
          "Booking.tn Verify Email",
          `<div><h1>Confirmation Email</h1>
        <h2>Hello</h2>
        <p>To activate your account , click the link below </p>
        <a href=${url}>Click Here</a>
        </div>`
        );
      }
      return res
        .status(400)
        .json({ message: "An Email sent to your account please check" });
    } else if (user.verified && token1) {
      token1 = await Token.findOne({ userId: user._id });
      await token1.remove();
    }
    // we gonna sign(hash) this data in jwt string format and for each api request we gonna use this jwt to verify our identity
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    // we're excluding password & isAdmin properties because they are sensitive data that shouldn't be returned to frontend using the user._doc(this statement is affecting the user._doc value to the ...otherProperties object)
    const { username, email, isAdmin, ...otherProperties } = user._doc;
    req.universalCookies.set("access_token", token, {
      // dissallow any secret client to reach this cookie => much secure
      httpOnly: false,
    })
    // send a cookie alongside the res object using the cookie method(cookie_name,jwt instance,config object)
    return res
      .status(200)
      .json({ details: { username, email }, isAdmin });
  } catch (error) {
    next(error);
  }
};

export const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image Required" });
    }

    const auth = authenticateGoogle();

    const response = await uploadToGoogleDrive(req.file, auth);
    deleteFile(req.file.path);
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};

export const deleteUFile = async (req, res, next) => {
  try {
    const auth = authenticateGoogle();
    await deleteUploaded(auth, req.params.fileId);
    res.status(200).json("Uploaded file successfully deleted");
  } catch (error) {
    next(error);
  }
};
