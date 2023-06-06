import {Request, Response, Router} from "express";
import {Model} from "mongoose";
import {Ticket, TicketModel, User, UserModel} from "../models";
import {UserService} from "./user.service";
import {SecurityUtils} from "../utils";

export class TicketService {
    readonly ticketModel: Model<Ticket>;
    readonly userModel: Model<User>;
    readonly userService: UserService;

    constructor() {
        this.ticketModel = TicketModel;
        this.userModel = UserModel;
        this.userService = new UserService();
    }

    async getTickets(req: Request, res: Response) {
        if(!req.user) {
            return res.status(401).json({message: "Unauthorized"}).end();
        }
        res.json(req.user.tickets).status(200).end();
    }

    async buyTicket(req: Request, res: Response) {
        const reqUser = req.user;
        if (!reqUser) {
            return res.status(401).json({message: "Unauthorized"}).end();
        }
        try {
            const ticketBody = req.body.ticket;
            const ticket = new Ticket(ticketBody.name, ticketBody.year, ticketBody.month, ticketBody.day);
            await this.ticketModel.create(ticket);

            const user = await this.userService.getUserByIdHelper(reqUser._id as string);
            user.tickets.push(ticket);
            await user.save();
            return res.json(ticket).status(201).end();
        }
        catch (error) {
            return res.status(400).json({error: error?.toString()});
        }
    }


    async getTicketById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        try {
            const ticket = await this.ticketModel.findById(id);
            if (ticket) {
                res.status(200).json(ticket);
            } else {
                res.status(404).json({ error: "Ticket not found" });
            }
        }
        catch (error) {
            res.status(400).json({ error: error?.toString() });
        }
    }


    async updateTicketById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        try {
            const ticket = await this.ticketModel.findById(id);
            if (ticket) {
                const bodyTicket = new Ticket(req.body.name || ticket.name, req.body.year, req.body.month, req.body.day);
                ticket.name = bodyTicket.name;
                ticket.start = bodyTicket.start;
                ticket.expiration = bodyTicket.expiration;
                await ticket.save();
                res.status(200).json({ message: "Ticket exchanged" });
            } else {
                res.status(404).json({ error: "Ticket not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
        }
    }
}