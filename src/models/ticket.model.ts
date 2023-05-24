import mongoose, {Model, Schema} from "mongoose";
import {Pass} from "../utils/ticket.utils";

const ticketSchema = new Schema<Ticket>({
    name: {
        type: Schema.Types.String,
        required: false
    },
    start: {
        type: Schema.Types.Date,
        required: true
    },
    expiration: {
        type: Schema.Types.Date,
        required: true
    }
}, {
    versionKey: false,
    collection: "Tickets"
});

export interface Ticket {
    name: Pass;
    start: Date;
    expiration: Date;
}

export const TicketModel: Model<Ticket> = mongoose.model("Ticket", ticketSchema);