const express = require("express");
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

// Validation Schemas
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// Routes
router.post("/signup", async (req, res) => {
    const { success, data, error } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.errors });
    }

    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
    });

    await Account.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(201).json({
        message: "User created successfully",
        token,
    });
});

router.post("/signin", async (req, res) => {
    const { success, data, error } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.errors });
    }

    const user = await User.findOne({ username: data.username });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token });
});

router.put("/", authMiddleware, async (req, res) => {
    const { success, data, error } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.errors });
    }

    await User.updateOne({ _id: req.userId }, { $set: data });

    res.json({ message: "Updated successfully" });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { $regex: `.*${filter}.*`, $options: "i" } },
            { lastName: { $regex: `.*${filter}.*`, $options: "i" } },
        ],
    });

    res.json({
        users: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});

module.exports = router;
