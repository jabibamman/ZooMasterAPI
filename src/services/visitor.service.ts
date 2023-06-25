import {Ticket, Attendance, AttendanceModel, Visitor, VisitorModel, AddVisitorDto, TicketModel} from "../models";
import {Response} from "express";
import { Model } from "mongoose";
import {Pass, SecurityUtils} from "../utils";
import {StaffService} from "./staff.service";


export class VisitorService {
    readonly visitorModel: Model<Visitor>;
    readonly ticketModel: Model<Ticket>;
    readonly attendanceModel: Model<Attendance>;
    readonly maxVisitors: number;

    constructor() {
        this.visitorModel = VisitorModel;
        this.ticketModel = TicketModel;
        this.attendanceModel = AttendanceModel;
        this.maxVisitors = 40;
    }

    public async addVisitor(visitor: AddVisitorDto, res : Response) {
        if(typeof visitor.email !== "string" || visitor.email.trim().length === 0) {
            res.status(400).end();
            return;
        }
        if(typeof visitor.name !== "string" || visitor.name.trim().length === 0) {
            res.status(400).end();
            return;
        }

        let tickets: Ticket[] = [];
        try {
            const result = await this.ticketModel.find({visitorEmail: visitor.email}).lean().exec();
            if (!result || result.length === 0) {
                res.status(404).end();
                return;
            }

            tickets = result as Ticket[];
        }
        catch(err: unknown) {
            res.status(404).end();
            return;
        }

        let isATicketValid = false;
        for(let i = 0; i < tickets.length; i++) {
            if(this.isValidPass(tickets[i])) {
                isATicketValid = true;
                break;
            }
        }
        if(!isATicketValid){
            res.status(400).end();
            return;
        }

        try {
            const visitorCount = await this.visitorModel.countDocuments();
            if (visitorCount >= this.maxVisitors) {
                res.status(409).end();
                return;
            }

            const name = visitor.name;
            const email = visitor.email;
            const createdVisitor = await this.visitorModel.create({
                name,
                email,
                tickets
            });
            console.log(await this.getCurrentAttendanceRate() + "%")
            await this.updateHourlyAttendanceRate(await this.getCurrentAttendanceRate())
            res.json(createdVisitor);
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
            console.log(await this.getCurrentAttendanceRate() + "%")
            await this.updateHourlyAttendanceRate(await this.getCurrentAttendanceRate())
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

    public async getAttendanceRate(res : Response){
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

    public async getCurrentAttendanceRate():Promise<number> {
        try {
            const visitorCount = await VisitorModel.countDocuments();
            return (visitorCount / this.maxVisitors) * 100;
        } catch(err: unknown) {
            console.log(err)
            throw Error("Couldn't gat attendance rate")
        }
    }

    public async getMonthlyAttendanceRate(res:Response,date: Date) {
        try {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const attendanceRates = await AttendanceModel.find({
                date: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            }).select('rate');

            const rates:number[] = [];
            for (const attendanceRate of attendanceRates) {
                rates.push((await attendanceRate).rate);
                console.log(rates)
            }

            const totalRates = rates.reduce((sum, rate) => sum + rate, 0);
            const averageRate = rates.length > 0 ? totalRates / rates.length : 0;

            res.json(`${averageRate}%`);
        } catch (err) {
            res.status(500).end();
        }
    }

    public async getWeeklyAttendanceRate(res: Response, date: Date) {
        try {
            const startOfWeek = new Date(date);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(date.getDate() - date.getDay());

            const endOfWeek = new Date(date);
            endOfWeek.setHours(23, 59, 59, 999);
            endOfWeek.setDate(date.getDate() - date.getDay() + 6);

            const attendanceRates = await AttendanceModel.find({
                date: {
                    $gte: startOfWeek,
                    $lte: endOfWeek
                }
            }).select('rate');

            const rates: number[] = [];
            for (const attendanceRate of attendanceRates) {
                rates.push((await attendanceRate).rate);
            }

            const totalRates = rates.reduce((sum, rate) => sum + rate, 0);
            const averageRate = rates.length > 0 ? totalRates / rates.length : 0;

            res.json(`${averageRate}%`);
        } catch (err) {
            res.status(500).end();
        }
    }

    public async getDailyAttendanceRate(res: Response, date: Date) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const attendanceRates = await AttendanceModel.find({
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }).select('rate');

            const rates: number[] = [];
            for (const attendanceRate of attendanceRates) {
                rates.push((await attendanceRate).rate);
            }

            const totalRates = rates.reduce((sum, rate) => sum + rate, 0);
            const averageRate = rates.length > 0 ? totalRates / rates.length : 0;

            res.json(`${averageRate}%`);
        } catch (err) {
            res.status(500).end();
        }
    }

    public async getHourlyAttendanceRate(res: Response, date: Date) {
        try {
            const startOfHour = new Date(date);
            startOfHour.setMinutes(0, 0, 0);

            const endOfHour = new Date(date);
            endOfHour.setMinutes(59, 59, 999);

            const attendanceRates = await AttendanceModel.find({
                date: {
                    $gte: startOfHour,
                    $lte: endOfHour
                }
            }).select('rate');

            const rates: number[] = [];
            for (const attendanceRate of attendanceRates) {
                rates.push((await attendanceRate).rate);
            }

            const totalRates = rates.reduce((sum, rate) => sum + rate, 0);
            const averageRate = rates.length > 0 ? totalRates / rates.length : 0;

            res.json(`${averageRate}%`);
        } catch (err) {
            res.status(500).end();
        }
    }

    public async updateHourlyAttendanceRate(rate:number):Promise<void>{
        try {
            const date = new Date();
            const startOfHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
            const endOfHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1);

            await AttendanceModel.findOneAndUpdate(
                {
                    date: {
                        $gte: startOfHour,
                        $lt: endOfHour
                    }
                },
                {
                    date,
                    rate
                },
                { upsert: true, new: true }
            );
            return
        } catch(err: unknown) {
            console.log(err)
            throw Error("Couldn't update attendance rate")
        }
    }

    public isValidPass(ticket: Ticket) {
        const today = new Date();
        if(ticket.start > today || ticket.expiration < today) {
            return false;
        }

        if(ticket.name == Pass.PASS_NIGHT) {
            return !StaffService.isNight(new Date());
        }
        if(StaffService.isNight(new Date())) {
            return false;
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
}
