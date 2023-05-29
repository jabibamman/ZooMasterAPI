import mongoose, {Model, Schema} from "mongoose";
import {Role} from "./role.model";
import {Ticket} from "./ticket.model";

const userSchema = new Schema<User>({
    login: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    }],
    tickets: [{
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        required: false
    }]
}, {
    versionKey: false,
    collection: "Users"
});

export interface User extends Document {
    login: string;
    password: string;
    roles: string[] | Role[];
    tickets: Ticket[]
}

export interface UserRegisterDto {
    login: string;
    password: string;
}

export interface UserLoginDto {
    login: string;
    password: string;
    headers: any;
}

export const UserModel: Model<User> = mongoose.model("User", userSchema);
