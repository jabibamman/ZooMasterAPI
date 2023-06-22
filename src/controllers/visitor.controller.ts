import {Request, Response, Router} from "express";
import * as express from "express";
import {VisitorRequest} from "../models";
import {VisitorService} from "../services";
import {checkUserToken} from "../middlewares";

export class VisitorController {

    readonly path: string;
    private visitorService: VisitorService;

    constructor() {
        this.path = "/visitor";
        this.visitorService = new VisitorService();

    }

    async addVisitor(req: Request, res: Response) {
        const visitor : VisitorRequest = {
            name: req.body.name,
            email: req.body.email,
            ticketType: req.body.ticketType,
        }

        return this.visitorService.addVisitor(visitor, res);
    }

    async removeVisitor(req: Request, res: Response) {
        const visitorID : string = req.body.visitorID
        return this.visitorService.removeVisitor(visitorID, res);
    }

    async getAttendanceRate(req: Request, res: Response) {
        return this.visitorService.getAttendanceRate(res);
    }

    async getMonthlyAttendanceRate(req: Request, res: Response) {
        const date : Date = new Date(req.body.date)
        return this.visitorService.getMonthlyAttendanceRate(res,date);
    }
    async getWeeklyAttendanceRate(req: Request, res: Response) {
        const date : Date = new Date(req.body.date)
        return this.visitorService.getWeeklyAttendanceRate(res,date);
    }
    async getDailyAttendanceRate(req: Request, res: Response) {
        const date : Date = new Date(req.body.date)
        return this.visitorService.getDailyAttendanceRate(res,date);
    }
    async getHourlyAttendanceRate(req: Request, res: Response) {
        const date : Date = new Date(req.body.date)
        return this.visitorService.getHourlyAttendanceRate(res,date);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', express.json(), this.addVisitor.bind(this));
        router.delete('/remove', express.json(), this.removeVisitor.bind(this));
        router.get('/rate', express.json(), this.getAttendanceRate.bind(this));
        router.post('/month', express.json(), this.getMonthlyAttendanceRate.bind(this));
        router.post('/week', express.json(), this.getWeeklyAttendanceRate.bind(this));
        router.post('/day', express.json(), this.getDailyAttendanceRate.bind(this));
        router.post('/hour', express.json(), this.getHourlyAttendanceRate.bind(this));
        return router;
    }
}