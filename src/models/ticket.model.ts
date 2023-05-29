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

export class Ticket {
    _id: string;
    name: Pass;
    start: Date;
    expiration: Date;

    constructor(name: Pass, year: number, month: number, day: number) {
        this._id = new mongoose.Types.ObjectId().toString();
        this.start = this.verifyDate(year, month, day);
        this.name = name;
        this.expiration = this.start; //TODO: set expiration date
    }

    verifyDate(year: number, month: number, day: number): Date {
        const date = new Date();
        date.setUTCFullYear(year);
        date.setUTCMonth(month - 1);
        date.setUTCDate(day);
        date.setUTCHours(0,0,0,0);

        if (isNaN(date.valueOf()) || date.getUTCFullYear() != year || date.getUTCMonth() != (month - 1) || date.getUTCDate() != day) {
            throw new Error("The input date is invalid");
        }

        const today = new Date();
        today.setUTCHours(0,0,0,0);

        if (date < today) {
            throw new Error("The ticket is already expired");
        }
        return date;
    }

    validateTicket(): boolean {
        const today = new Date();
        if(this.start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(this.expiration < today) {
            throw new Error("This ticket is expired");
        }
        if(today.getHours() < 9 || today.getHours() > 19) {
            throw new Error("You can't use this ticket at this hour")
        }
        return true;
    }
}

export interface TicketRequest {
    name: Pass;
}

export const TicketModel: Model<Ticket> = mongoose.model("Ticket", ticketSchema);