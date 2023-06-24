import {Request, Response} from "express";
import {Model} from "mongoose";
import {BuyTicketDto, Ticket, TicketModel, Visitor, VisitorModel} from "../models";
import {SecurityUtils} from "../utils";
import {VisitorService} from "./visitor.service";

export class TicketService {
    readonly ticketModel: Model<Ticket>;
    readonly visitorModel: Model<Visitor>;
    readonly visitorService: VisitorService;

    constructor() {
        this.ticketModel = TicketModel;
        this.visitorModel = VisitorModel;
        this.visitorService = new VisitorService()
    }

    async getTicketsByEmail(email: string, res: Response) {
        if(!email || typeof email !== "string") {
            return res.status(400).json().end();
        }

        const tickets = await this.ticketModel.find({visitorEmail: email}).exec();
        if (!tickets || tickets.length === 0) {
            return res.status(404).end();
        }

        return res.json(tickets).status(200).end();
    }

    async buyTicket(buyDto: BuyTicketDto, res: Response) {
        if(!buyDto.email || buyDto.email.trim().length === 0) {
            res.status(400).end();
            return;
        }
        if(!buyDto.pass || buyDto.pass.trim().length === 0) {
            res.status(400).end();
            return;
        }

        try {
            const ticket = new Ticket(buyDto.email, buyDto.pass, buyDto.year, buyDto.month, buyDto.day);
            const result = await this.ticketModel.create(ticket);
            return res.json(result).status(201).end();
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
                const bodyTicket = new Ticket(req.body.email, req.body.name || ticket.name, req.body.year, req.body.month, req.body.day);
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