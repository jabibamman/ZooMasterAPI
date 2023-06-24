import {Request, Response, Router} from "express";
import * as express from "express";
import {checkUserRole, checkUserToken} from "../middlewares";
import {Roles} from "../utils";
import {TicketService} from "../services";
import {BuyTicketDto} from "../models";

export class TicketController {
    readonly path;
    private ticketService;

    constructor() {
        this.path = "/ticket";
        this.ticketService = new TicketService();
    }
    async getTicketsByEmail(req: Request, res: Response) {
        const email: string = req.body.email as string;
        await this.ticketService.getTicketsByEmail(email, res);
    }
    async buyTicket(req: Request, res: Response) {
        const visitorBody: BuyTicketDto = {
            email: req.body.email,
            pass: req.body.pass,
            year: req.body.year,
            month: req.body.month,
            day: req.body.day
        }

        await this.ticketService.buyTicket(visitorBody, res);
    }
    async getTicketById(req: Request, res: Response) {
        await this.ticketService.getTicketById(req, res);
    }
    async updateTicketById(req: Request, res: Response) {
        await this.ticketService.updateTicketById(req, res);
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', express.json(), checkUserToken(), this.getTicketsByEmail.bind(this));
        router.post('/', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN, Roles.TICKET_SELLER]), this.buyTicket.bind(this));
        router.get('/:id', checkUserToken(), this.getTicketById.bind(this));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN, Roles.TICKET_SELLER]), this.updateTicketById.bind(this));
        return router;
    }
}