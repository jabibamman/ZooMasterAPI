import { config } from "dotenv";
config();

import mongoose from "mongoose";
import express = require("express");

import {StaffController, UserController} from './controllers';
import { RoleModel, } from "./models";
import { roles } from "./utils";

async function startServer(): Promise<void> {
    const connect = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_ROOT_USERNAME,
            password: process.env.MONGO_ROOT_PASSWORD,
        },
        authSource: "admin",
    });

   upsertRoles();

    const app = express();
    const userController = new UserController();
    const staffController = new StaffController();
    app.use(userController.path, userController.buildRoutes());
    app.use(staffController.path, staffController.buildRoutes());
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}   

async function upsertRoles() {
    const countRoles = await RoleModel.countDocuments().exec();
    if (countRoles !== 0) {
        return;
    }
    const rolesNames = roles.map((role) => role);
    const rolesRequests = rolesNames.map((roleName) => {
        return RoleModel.findOneAndUpdate(
            { name: roleName },
            { name: roleName },
            { upsert: true, new: true }
        ).exec();

    });

    await Promise.all(rolesRequests);
}



startServer().then(() =>
    console.log("Connected to MongoDB")
).catch((err) => {
    console.log(err);
});