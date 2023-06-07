import mongoose, {Model, Schema} from "mongoose";
import {Pass} from "../utils";

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
        this.name = name;
        this.start = this.verifyDate(year, month, day);
        this.expiration = this.setExpirationDate();
    }

    private verifyDate(year: number, month: number, day: number): Date {
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
        if (this.name == Pass.PASS_DAYMONTH) {
            date.setUTCDate(1);
        }
        return date;
    }


    private setExpirationDate(): Date {
        const date = new Date(this.start);
        date.setUTCHours(23,59,59,999);

        if (this.name == Pass.PASS_DAY || this.name == Pass.PASS_ESCAPEGAME || this.name == Pass.PASS_NIGHT) {
            return date;
        }
        if (this.name == Pass.PASS_WEEKEND) {
            if(this.start.getUTCDay() != 6) {
                throw new Error("The ticket is a PASS WEEKEND but it doesn't start on Saturday");
            }
            date.setUTCDate(date.getUTCDate() + 1);
            return date;
        }
        if (this.name == Pass.PASS_YEAR || this.name == Pass.PASS_DAYMONTH) {
            date.setUTCFullYear(date.getUTCFullYear() + 1);
            return date;
        }
        throw new Error("The ticket is invalid");
    }


    validateTicket(): boolean {
        const today = new Date();
        if(this.start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(this.expiration < today) {
            throw new Error("This ticket is expired");
        }

        if (this.name == Pass.PASS_NIGHT) {
            if(today.getHours() < 21 || today.getHours() > 2) {
                throw new Error("You can't use this ticket at this hour")
            }
            return true;
        }
        if(today.getHours() < 9 || today.getHours() > 19) {
            throw new Error("You can't use this ticket at this hour")
        }
        if (this.name == Pass.PASS_DAYMONTH) {
            if(today.getMonth() + 1 > 11) {
                this.start = new Date(today.getFullYear() + 1, 0, 1);
                return true;
            }
            this.start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        }
        return true;
    }
}

export const TicketModel: Model<Ticket> = mongoose.model("Ticket", ticketSchema);