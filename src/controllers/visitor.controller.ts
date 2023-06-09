import {Request, Response, Router} from "express";
import * as express from "express";
import {VisitorRequest} from "../models";
import {VisitorService} from "../services";
import {checkUserRole, checkUserToken} from "../middlewares";
import {Roles} from "../utils";

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
            tickets: req.body.tickets,
        }

        return this.visitorService.addVisitor(visitor, res);
    }

    async removeVisitor(req: Request, res: Response) {
        const visitorID : string = req.body.visitorID
        return this.visitorService.removeVisitor(visitorID, res);
    }

    async admin(req: Request, res: Response) {
        return this.visitorService.admin(res);
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
        router.post('/add', express.json(), checkUserToken(), checkUserRole([Roles.RECEPTION_STAFF]), this.addVisitor.bind(this));
        router.delete('/remove', express.json(), checkUserToken(), checkUserRole([Roles.RECEPTION_STAFF]), this.removeVisitor.bind(this));
        router.get('/admin', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.admin.bind(this));
        router.get('/rate', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.getAttendanceRate.bind(this));
        router.post('/month', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.getMonthlyAttendanceRate.bind(this));
        router.post('/week', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.getWeeklyAttendanceRate.bind(this));
        router.post('/day', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.getDailyAttendanceRate.bind(this));
        router.post('/hour', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.getHourlyAttendanceRate.bind(this));
        return router;
    }
}