import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createdAccessToken } from "../libs/jwt.js";


export const register = async (req, res) => {
  const { email, password, username, role, fullName, phone, address } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role || 'admin',
      fullName,
      phone,
      address
    });
    const userSaved = await newUser.save();
    const token = await createdAccessToken({ id: userSaved._id, role: userSaved.role });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      fullName: userSaved.fullName,
      role: userSaved.role,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Invalid credential, try again" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credential, try again" });

    const token = await createdAccessToken({ id: userFound._id, role: userFound.role });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false // Cambia a true si usas https en producción
    });
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      fullName: userFound.fullName,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

export const profile = async (req, res) => {
    //console.log(req.user);
    const userFound = await User.findById(req.user.id);

    if(!userFound)
        return res.status(400).json({ message: "User not found :("});

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        fullName: userFound.fullName,
        role: userFound.role,
        phone: userFound.phone,
        address: userFound.address,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    })
    //res.send('profile');
}

