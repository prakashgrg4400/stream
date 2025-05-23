import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        bio: {
            type: String,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        nativeLanguage: {
            type: String,
            default: "",
        },
        learningLanguage: {
            type: String,
            default: "",
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isOnBoarded: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // this will handle the control to the next middleware , and stop the execution of the code in the current middleware. Meaning code below this line will not be executed .
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
        console.log("Error from pre save 'password' .");
    }
});

// this methods will be directly accessed by each doccuments which is fetched from the database.
userSchema.methods.matchPassword = async function (userPassword, hashPassword) {
    const isPasswordSame = await bcrypt.compare(userPassword, hashPassword);
    return isPasswordSame;
};

export const User = mongoose.model("User", userSchema);
