import {Request, Response, Router} from "express";
import * as express from "express";
import {checkUserRole, checkUserToken} from "../middlewares";
import {Roles} from "../utils";
import {TicketService} from "../services";

export class TicketController {
    readonly path;
    private ticketService;

    constructor() {
        this.path = "/ticket";
        this.ticketService = new TicketService();
    }
    async getTickets(req: Request, res: Response) {
        await this.ticketService.getTickets(req, res);
    }
    async buyTicket(req: Request, res: Response) {
        await this.ticketService.buyTicket(req, res);
    }
    async getTicketById(req: Request, res: Response) {
        await this.ticketService.getTicketById(req, res);
    }
    async updateTicketById(req: Request, res: Response) {
        await this.ticketService.updateTicketById(req, res);
    }


    buildRoutes() {
        const router = express.Router();
        router.get('/', checkUserToken(), this.getTickets.bind(this));
        router.post('/', express.json(), checkUserToken(), this.buyTicket.bind(this));
        router.get('/:id', checkUserToken(), this.getTicketById.bind(this));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.updateTicketById.bind(this));
        return router;
    }
}