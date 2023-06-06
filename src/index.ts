import { EnclosureController } from './controllers/enclosure.controller';
import { config } from "dotenv";
config();

import mongoose from "mongoose";
import express = require("express");

import {
    AnimalController,
    StaffController,
    UserController,
    MaintenanceController,
    TicketController,
    VisitorController
} from './controllers';
import { RoleModel, } from "./models";
import { roles } from "./utils";
import { TreatmentController } from './controllers/treatment.controller';

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
    const visitorController = new VisitorController();
    const enclosureController = new EnclosureController();
    const animalController = new AnimalController();
    const maintenanceController = new MaintenanceController();
    const treatmentController = new TreatmentController();
    const ticketController = new TicketController();
    app.use(userController.path, userController.buildRoutes());
    app.use(staffController.path, staffController.buildRoutes());
    app.use(visitorController.path, visitorController.buildRoutes());
    app.use(enclosureController.path, enclosureController.buildRoutes());
    app.use(animalController.path, animalController.buildRoutes());
    app.use(maintenanceController.path, maintenanceController.buildRoutes());
    app.use(treatmentController.path, treatmentController.buildRoutes());
    app.use(ticketController.path, ticketController.buildRoutes());
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