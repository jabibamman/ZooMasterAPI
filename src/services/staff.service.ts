import {Staff, StaffModel, StaffRequest} from "../models";
import {Response} from "express";
import { Model } from "mongoose";

function isNight(dateString: Date): boolean {
    const startNightHour = 20;
    const endNightHour = 6;

    const date = new Date(dateString);

    const hour = date.getUTCHours();

    return hour >= startNightHour || hour < endNightHour;
}

export class StaffService {
    readonly model: Model<Staff>;

    constructor() {
        this.model = StaffModel;
    }

    public async registerStaff(staff: StaffRequest, res : Response) {
        if(!staff) {
            res.status(400).end();
            return;
        }
        const hosts: string[] = staff.hosts;
        const healers: string[] = staff.healers;
        const cleaners: string[] = staff.cleaners;
        const sellers: string[] = staff.sellers;
        const date: Date = staff.date;

        try {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);

            const existingStaff = await StaffModel.findOneAndReplace(
                {
                    date: { $gte: startDate, $lt: endDate }
                },
                {
                    hosts,
                    healers,
                    cleaners,
                    sellers,
                    date
                },
                { upsert: true, new: true }
            );

            res.json(existingStaff);
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    public async openZoo(date: Date, res : Response) {
        if(!date) {
            res.status(400).end();
            return;
        }

        try {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7);

            const staff = await StaffModel.find({
                date: { $gte: startDate, $lt: endDate }
            });
            if(staff[0]) res.json("Le parc peut être ouvert cette semaine !");
            else res.json("Le parc n'a pas assez de staff pour ouvrir cette semaine.");
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    public async openNightZoo(date: Date, res : Response) {

        if(!date) {
            res.status(400).end();
            return;
        }

        if(!isNight(date)) res.json("Il ne fait pas encore nuit...");
        else res.json("Le parc est ouvert cette nuit !");
    }
}
