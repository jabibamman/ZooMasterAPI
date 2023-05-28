import mongoose, {Model, Schema} from "mongoose";
import {User} from "./user.model";

const staffSchema = new Schema<Staff>({
    hosts: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],
    healers: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],
    cleaners: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],
    sellers: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],
    date: {
        type: Schema.Types.Date,
        required: true
    }
}, {
    versionKey: false,
    collection: "Staff"
});

export interface Staff {
    hosts: User[],
    healers: User[],
    cleaners: User[],
    sellers: User[],
    date: Date
}

export interface StaffRequest {
    hosts: string[],
    healers: string[],
    cleaners: string[],
    sellers: string[],
    date: Date
}

export const StaffModel: Model<Staff> = mongoose.model("Staff", staffSchema);
