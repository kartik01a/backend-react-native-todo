import { RequestHandler } from "express";
import { User, Category } from "../models/schema";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import Jwt from "jsonwebtoken";
import { ICategory } from "../../types";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const pass: RegExp =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    // check input for correctness
    if (!pass.test(password.toString()))
      return res
        .status(400)
        .json({
          msg: "Enter valid password with uppercase, lowercase, number & @",
        });
    if (!expression.test(email.toString()))
      return res.status(400).json({ msg: "Enter valid email" });

    const existinguser = await User.findOne({ email });

    if (existinguser) {
      return res.status(407).json({ message: "User already Exist" });
    }
    // password hashing
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password.toString(), salt);
    await new User({ name, email, password: hashPassword }).save();

    res.status(200).json({ msg: "New user registered" });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existinguser = await User.findOne({ email });
    // console.log(existinguser,"Email  ",email)
    //if user is not found
    if (!existinguser) {
      return res.status(407).json({ message: "User not Exist" });
    }
    const isMatch = compareSync("" + password, existinguser.password);
    //if password doens't match
    if (!isMatch) {
      return res.status(407).json({ message: "Password not match" });
    }
    const id = existinguser._id;
    let refereshToken = "",
      AccessToken = "";

    refereshToken = await Jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET_KEY!,
      {
        expiresIn: "2h",
      }
    );
    AccessToken = await Jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "30m",
    });
    res.cookie("authToken", AccessToken, { httpOnly: true });
    res.cookie("refreshToken", refereshToken, { httpOnly: true });

    res.status(201).json({
      refereshToken,
      AccessToken,
      message: "User logged in successfully",
    });

    next();
  } catch (err) {
    res.status(407).json({ message: err });
  }
};

export const getAllCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await Category.find().select("-password").exec();
    console.log(category);
    res.status(200).json({ category });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};

export const createCategory: RequestHandler = async (req, res, next) => {

    try {
      const { color, icon, isEditable, name }:ICategory = req.body;

    const category = await Category.create({
        color,icon,isEditable,name
    })
    console.log(category);
    res.status(200).json({ category });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};
