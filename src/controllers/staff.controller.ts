import {Request, Response, Router} from "express";
import * as express from "express";
import {StaffRequest} from "../models";
import {StaffService} from "../services";
import {checkUserRole, checkUserToken} from "../middlewares";
import {Roles} from "../utils";

export class StaffController {

    readonly path: string;
    private staffService: StaffService;

    constructor() {
        this.path = "/staff";
        this.staffService = new StaffService();

    }

    async registerStaff(req: Request, res: Response) {
        const staff : StaffRequest = {
            hosts: req.body.hosts,
            healers: req.body.healers,
            cleaners: req.body.cleaners,
            sellers: req.body.sellers,
            date: req.body.date,
        }

        return this.staffService.registerStaff(staff, res);
    }

    async openZoo(req: Request, res: Response) {
        const date : Date = req.body.date

        return this.staffService.openZoo(date, res);
    }

    async openNightZoo(req: Request, res: Response){
        const date : Date = req.body.date
        return this.staffService.openNightZoo(date, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/register', express.json(), this.registerStaff.bind(this));
        router.post('/open', express.json(), this.openZoo.bind(this));
        router.put('/open/night/:id', express.json(),checkUserToken(), checkUserRole([Roles.ADMIN]), this.openNightZoo.bind(this));
        return router;
    }
}