import { User } from "../model/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    try {
        console.log("body ==> ", req.body);

        const { fullName, email, password } = req.body;

        // checking if all the fields are not empty
        if (!fullName || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "All the fields are required",
            });
        }

        // checking if the password is less than 6
        if (password.length <= 6) {
            return res.status(400).json({
                status: "error",
                message: "Password length must be greater than 6",
            });
        }

        // checking the email pattern for valid email address .
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "error",
                message: "Enter a valid email address",
            });
        }


        const existingUser = await User.findOne({ email: email });

        // checking if the user with same email already exists
        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "User with this email already exists.",
            });
        }

        // generating avatar for the user
        let randomNumber = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${randomNumber}`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: avatar,
        });

        // creating jwt token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.status(201).json({
            status: "success",
            user: {
                newUser,
            },
        });
    } catch (error) {
        console.log("error while signing ==> ", error);
        res.status(500).json({ status: "error", error: error });
    }
}

export async function login(req, res) {
    res.send("login");
}

export async function logout(req, res) {
    res.send("logout");
}
