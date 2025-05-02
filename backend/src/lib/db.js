import mongoose from "mongoose";

const databaseConnect = async function () {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Mongodb connected : `, conn.connection.host);
    } catch (err) {
        console.log(`Failed to connect to mongodb : `, err);
        process.exit(1);
    }
};

export default databaseConnect;
