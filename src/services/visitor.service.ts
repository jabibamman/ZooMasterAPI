import {Ticket, UserModel, Visitor, VisitorModel, VisitorRequest} from "../models";
import {Response} from "express";
import { Model } from "mongoose";
import {Pass, SecurityUtils} from "../utils";

export class VisitorService {
    readonly model: Model<Visitor>;
    readonly maxVisitors: number;

    constructor() {
        this.model = VisitorModel;
        this.maxVisitors = 5;
    }

    public async addVisitor(visitor: VisitorRequest, res : Response) {
        if(!visitor) {
            res.status(400).end();
            return;
        }

        if(visitor.name.trim().length === 0) {
            res.status(400).end();
            return;
        }

        if(visitor.email.trim().length === 0) {
            res.status(400).end();
            return;
        }

        let isATicketValid = false;
        for(let i = 0; i < visitor.tickets.length; i++) {
            if(this.isValidPass(visitor.tickets[i])){
                isATicketValid = true;
                break;
            }
        }
        if(!isATicketValid){
            res.status(400).end();
            return;
        }

        const name: string = visitor.name;
        const email: string = visitor.email;
        const tickets: Ticket[] = visitor.tickets;

        try {
            const visitorCount = await VisitorModel.countDocuments();
            if (visitorCount >= this.maxVisitors) {
                res.status(409).end();
                return;
            }

            const visitor = await VisitorModel.create({
                name,
                email,
                tickets
            });
            res.json(visitor);
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    public async removeVisitor(visitorID: string, res : Response) {
        if(!visitorID) {
            res.status(400).end();
            return;
        }

        try {
            SecurityUtils.checkIfIdIsCorrect(visitorID);
        } catch (err) {
            res.status(400).json({ message: err?.toString() }).end();
            return;
        }

        try {
            const visitor = await VisitorModel.findByIdAndDelete(visitorID);
            res.json(visitor);
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    public async getAttendanceRate(res : Response) {
        try {
            const visitorCount = await VisitorModel.countDocuments();
            const rate = (visitorCount / this.maxVisitors) * 100
            res.json(`${rate}%`);
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    //TODO: check staff.service.ts for pass night
    public isValidPass(ticket: Ticket) {
        const today = new Date();
        if(ticket.start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(ticket.expiration < today) {
            throw new Error("This ticket is expired");
        }

        if (ticket.name == Pass.PASS_NIGHT) {
            if(today.getHours() < 21 || today.getHours() > 2) {
                throw new Error("You can't use this ticket at this hour")
            }
            return true;
        }
        if(today.getHours() < 9 || today.getHours() > 19) {
            throw new Error("You can't use this ticket at this hour")
        }
        if (ticket.name == Pass.PASS_DAYMONTH) {
            if(today.getMonth() + 1 > 11) {
                ticket.start = new Date(today.getFullYear() + 1, 0, 1);
                return true;
            }
            ticket.start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        }
        return true;
    }

    public async getVisitorByEmail(visitorEmail: string): Promise<typeof VisitorModel.prototype | null> {
        if(!visitorEmail) {
            return null;
        }
        return await VisitorModel.findOne({email: visitorEmail}).exec();
    }
}
