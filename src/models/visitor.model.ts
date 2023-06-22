import mongoose, {Model, Schema} from "mongoose";
import {Ticket} from "./ticket.model";

const visitorSchema = new Schema<Visitor>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required: true
    },
    tickets: [{
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        required: false
    }]
}, {
    versionKey: false,
    collection: "Visitors"
});

export interface Visitor extends Document {
    name: string,
    email: string,
    tickets: Ticket["_id"];
}

export interface VisitorRequest {
    name: string,
    email: string,
    tickets: Ticket[];
}

export const VisitorModel: Model<Visitor> = mongoose.model("Visitor", visitorSchema, "Visitors");
