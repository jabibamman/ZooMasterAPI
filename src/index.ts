import { config } from "dotenv";
config();

import mongoose from "mongoose";
import express = require("express");

import { UserController } from './controllers';
import { RoleModel } from "./models";


async function startServer(): Promise<void> {
    const connect = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_ROOT_USERNAME,
            password: process.env.MONGO_ROOT_PASSWORD,
        },
        authSource: "admin",
    });

   //upsertRoles();

    const app = express();
    const userController = new UserController();
    app.use(userController.path, userController.buildRoutes());
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
}   

async function upsertRoles() {
    //const countRoles = await AnimalModel.count().exec();
     /*if(countRoles === 0) {
         return;
     }*/
     const rolesNames = ["admin", "veterinarian", "animal_caretaker", "maintenance_worker", "ticket_seller", "reception_staff",  "guest"];
     const rolesRequests = rolesNames.map((roleName) => {
         return RoleModel.create({
             name : roleName
         });
     });
 
     await Promise.all(rolesRequests);
 }


startServer().then(() =>
    console.log("Connected to MongoDB")
).catch((err) => {
    console.log(err);
});