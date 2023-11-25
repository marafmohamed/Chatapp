const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const CreateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.login(Email, Password);
    const token = CreateToken(user._id);
    res.status(200).json({ Email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { Name, Email, Password } = req.body;
  try {
    const user = await User.signup(Name, Email, Password);
    const token = CreateToken(user._id);
    res.status(200).json({ Email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const Searchuser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { Name: { $regex: req.query.search, $options: "i" } },
          { Email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const result = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    res.send(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  Searchuser,
};
