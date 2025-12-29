import { createUser, findUserByEmail } from "../services/auth.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ----------------- Helper ----------------- */
// Check if user is already logged in via cookie
const checkIfLoggedIn = (req) => {
  const token = req.cookies?.syncodeToken;
  if (!token) return false;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

/* ----------------- Signup ----------------- */
export const signup = async (req, res) => {
  try {
    if (checkIfLoggedIn(req)) {
      return res.status(403).json({ error: "You are already logged in" });
    }

    const {
      companyName,
      registrationNumber,
      country,
      state,
      industryType,
      fullName,
      email,
      mobile,
      designation,
      password,
      acceptedNDA,
      acceptedDataConsent,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      company: {
        name: companyName,
        registrationNumber,
        country,
        state,
        industryType,
      },
      user: {
        fullName,
        email,
        mobile,
        designation,
        password: hashedPassword,
        acceptedNDA,
        acceptedDataConsent,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set HTTP-only cookie
    res.cookie("syncodeToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
    });

    // Respond without password
    const { password: _, ...userSafe } = user;
    res
      .status(201)
      .json({ message: "User created successfully", user: userSafe });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

/* ----------------- Login ----------------- */
export const login = async (req, res) => {
  try {
    if (checkIfLoggedIn(req)) {
      return res.status(403).json({ error: "You are already logged in" });
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("syncodeToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userSafe } = user;
    res.json({ message: "Login successful", user: userSafe });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("syncodeToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
};
