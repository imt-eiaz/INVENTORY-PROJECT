import bcypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ succes: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    return res.status(200).json({succes : true, message : "Login Successfull", token, user: user._id, name : user.name, email : user.email, role: user.role
    }) 
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export { login };
