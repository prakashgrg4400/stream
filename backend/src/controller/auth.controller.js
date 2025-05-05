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

        // setting cookie , so we can send jwt token along with the response
        res.cookie("token", `${token}`, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // set expiry date for the cookie in millisecond .
            httpOnly: true, // prevent from XSS attack
            sameSite: "strict", // prvent from CSRF attack
            secure: process.env.NODE_ENV === "production",
        });

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
    try {
        const { email, password } = req.body;

        // checking both email and password is not empty
        if (!email || !password) {
            return res.status(401).json({
                status: "error",
                message: "Both Email and Password are required",
            });
        }

        // checking if the credientials entered by user is available in database or not.
        const existingUser = await User.findOne({ email: email });
        console.log("user = > ", existingUser);
        if (!existingUser) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // checking if password is same as the password stored in the database .
        const validPassword = await existingUser.matchPassword(
            password,
            existingUser.password
        );
        console.log("valid password => ", validPassword);

        if (!validPassword) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password",
            });
        }

        // creating jwt token and sending through cookie .
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: "7d",
            }
        );
        res.cookie("jwt", `${token}`, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        // finally if everything is matched sending response .
        res.status(200).json({
            status: "success",
            user: existingUser,
        });
    } catch (err) {
        console.log("error of login ==> ", err);
        res.status(500).json({ message: err });
    }
}

export async function logout(req, res) {
    res.send("logout");
}
