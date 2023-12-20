import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModal from "../models/user.js";


export const signin = async (req, res) => {
    const { email, password } = req.body;
    const secret = process.env.DBPASSWORD;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (!oldUser) return res.status(404).json({ error: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, name } = req.body;
    const secret = process.env.DBPASSWORD;
    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) return res.status(400).json({ error: "User already exists" });

        if (password != confirmPassword) return res.status(400).json({ error: "Password doesn't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({ email, password: hashedPassword, name, age: "", dob: "", gender: "", mobile: "", address: "" });

        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const result = await UserModal.updateOne({ _id: req.userId }, { $set: req.body });
        if (result.modifiedCount > 0 || result.matchedCount > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const getProfile = async (req, res) => {
    try {
        const result = await UserModal.findOne({ _id: req.userId })
        if (result) {
            res.status(200).json({ result });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}