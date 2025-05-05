import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";
import databaseConnect from "./lib/db.js";

const app = express();
dotenv.config();

let port = process.env.PORT;

// it helps to find the convert the data send by client into , json format. And puts this foramtted inside req.body , so express can track the data send by client. IF we dont use express.json() , than express will not be able to track the input send by user, and req.body will be undefined . 
//! NOTE :: when user or client send request to the server , than the data send during that server will be a big chunk of string , even though the data is send in json format from the client side. THat json format data is received as a big chunk of string in the backend. So, express.json() parses this chunk of string into json format, and adds it in req.body , so we can access the data send by the user.
app.use(express.json());


app.use("/api/auth", router);

app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
    databaseConnect();
});
 