import express from "express";
import {User} from "./model/user.models.js";
import bcrypt from "bcryptjs";

const app = express();

const PORT = 6000;

app.get("/", (req, res) => {
  res.json(
    {
      status: "status server heathy running",
    },
    200
  );
});

app.post("/sigup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(200).json({
        message: "required value not exits",
      });
    }

    const existingUser = await User.findone({ email });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    conswole.error("user not exits");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "invailid authentiicate",
      });
       const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "User not found." });
        }
      
        const unhashedPassword = await bcrypt.compare(password, user.password);
        if (!unhashedPassword) {
          return res.status(400).json({ message: "Invalid password." });
        }
      
        return res.status(200).json({ message: "Sign in successful." });
    }
  } catch (error) {}
});

app.listen(6000, (req, res) => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
