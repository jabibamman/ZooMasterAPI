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

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/add', express.json(), this.addVisitor.bind(this));
        router.delete('/remove', express.json(), this.removeVisitor.bind(this));
        router.get('/rate', express.json(), this.getAttendanceRate.bind(this));
        return router;
    }
}