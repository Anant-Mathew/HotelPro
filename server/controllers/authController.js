const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "hotelpro_super_secret_jwt_key_2026";

const signUp = async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({ msg: "All fields are required", status: false });
    }

    const existingUser = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already register", status: "false" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: Number(phone),
      userType
    });

    return res.status(200).json({
      msg: "User registered successfully",
      status: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error("SignUp error:", error);
    return res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required", status: false });
    }

    const user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password", status: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password", status: false });
    }

    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      status: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    // Exclude password for security
    const sanitized = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      userType: u.userType,
      createdAt: u.createdAt
    }));
    return res.status(200).json(sanitized);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ msg: "Failed to fetch users", error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  getAllUsers
};
