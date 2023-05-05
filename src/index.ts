import { config } from "dotenv";
config();

import mongoose from "mongoose";
import express = require("express");

async function startServer(): Promise<void> {
    const connect = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_ROOT_USERNAME,
            password: process.env.MONGO_ROOT_PASSWORD,
        },
        authSource: "admin",
    });

    const app = express();
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}      

startServer().then(() =>
    console.log("Connected to MongoDB")
).catch((err) => {
    console.log(err);
});