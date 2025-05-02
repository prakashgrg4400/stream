import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import databaseConnect from "./lib/db.js";

const app = express();
dotenv.config();

let port = process.env.PORT;

app.use("/api/auth", router);

app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
    databaseConnect();
});
