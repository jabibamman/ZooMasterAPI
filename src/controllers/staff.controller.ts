import {Request, Response, Router} from "express";
import * as express from "express";
import {Staff, StaffRequest} from "../models";
import {StaffService} from "../services";

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


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/register', express.json(), this.registerStaff.bind(this));
        router.post('/open', express.json(), this.openZoo.bind(this));
        return router;
    }
}