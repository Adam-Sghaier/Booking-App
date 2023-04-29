import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import Token from "../models/Token.js";
import { sendVerification } from "../utils/email.js";

export const resetPassEmail = async (req, res, next) => {
  // it's recommended to use try/catch block with api requests and DB interactions( like the datasave)
  try {
    // 1/check the email format
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    // 2/ format is correct => check the existence of the user
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .json({ message: "User with given email does not exist" });

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const route = `login/password_reset/${user._id}/${token.token}`;

    let url;
    if (Number(req.rawHeaders[5]) === 3000) {
      url = `${process.env.BASE_URL_C}${route}`;
    }
    else {
      url = `${process.env.BASE_URL_A}${route}`;
    }


    await sendVerification(user.email, "Booking.tn Password Reset", `<div><h1>Reset Password Email</h1>
    <h2>Hello</h2>
    <p>To reset your password , click the link below </p>
    <a href=${url}>Click Here</a>
    </div>`);

    res
      .status(200)
      .json({ message: "password reset link sent to your email account" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyLink = async (req, res) => {
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
    res.status(200).json("Valid Url");
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const setPassword = async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).json({ message: "Invalid link" });

    if (!user.verified) {

      const url = `${process.env.BASE_URL}users/verify/${user._id}/${token.token}`;
      await sendVerification(user.email, "Booking.tn Password Reset", `<div><h1>Reset Password Email</h1>
        <h2>Hello</h2>
        <p>To reset your password , click the link below </p>
        <a href=${url}>Click Here</a>
        </div>`);

      return res
        .status(400)
        .json({ message: "An Email sent to your account please verify your email and return back to your password-reset page" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    user.password = hashPassword;
    await user.save();
    await token.remove();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
