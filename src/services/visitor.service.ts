import {Visitor, VisitorModel, VisitorRequest} from "../models";
import {Response} from "express";
import { Model } from "mongoose";
import {SecurityUtils} from "../utils";


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

        if(visitor.ticketType.trim().length === 0) {
            res.status(400).end();
            return;
        }

        if(!isValidPass(visitor.ticketType)){
            res.status(400).end();
            return;
        }

        const name: string = visitor.name;
        const email: string = visitor.email;
        const ticketType: string = visitor.ticketType;

        try {
            const visitorCount = await VisitorModel.countDocuments();
            if (visitorCount >= this.maxVisitors) {
                res.status(409).end();
                return;
            }

            const visitor = await VisitorModel.create({
                name,
                email,
                ticketType
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
}
 