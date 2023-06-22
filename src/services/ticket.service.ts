import {Request, Response} from "express";
import {Model} from "mongoose";
import {BuyTicketDto, Ticket, TicketModel, User, UserModel, VisitorModel} from "../models";
import {SecurityUtils} from "../utils";
import {VisitorService} from "./visitor.service";

export class TicketService {
    readonly ticketModel: Model<Ticket>;
    readonly userModel: Model<User>;
    readonly visitorService: VisitorService;

    constructor() {
        this.ticketModel = TicketModel;
        this.userModel = UserModel;
        this.visitorService = new VisitorService()
    }

    //TODO: get all tickets of a visitor by id or email idk
    async getTickets(req: Request, res: Response) {
        if(!req.user) {
            return res.status(401).json({message: "Unauthorized"}).end();
        }
        res.json(req.user.tickets).status(200).end();
    }
    
    async buyTicket(buyDto: BuyTicketDto, res: Response) {
        if(buyDto.name.trim().length === 0) {
            res.status(400).end();
            return;
        }
        if(buyDto.email.trim().length === 0) {
            res.status(400).end();
            return;
        }
        if(buyDto.pass.trim().length === 0) {
            res.status(400).end();
            return;
        }

        try {
            const ticket = new Ticket(buyDto.email, buyDto.pass, buyDto.year, buyDto.month, buyDto.day);
            await this.ticketModel.create(ticket);

            const visitor = await this.visitorService.getVisitorByEmail(buyDto.email);

            if (!visitor) {
                const newVisitor = await VisitorModel.create({
                    name: buyDto.name,
                    email: buyDto.email,
                    tickets: [ticket]
                });
                res.json(newVisitor).status(201).end();
                return;
            }

            visitor.tickets.push(ticket);
            await visitor.save();
            return res.json(visitor).status(201).end();
        }
        catch (error) {
            return res.status(400).json({error: error?.toString()});
        }
    }


    //TODO: idk if this is needed
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