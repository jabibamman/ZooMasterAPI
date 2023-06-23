import {Request, RequestHandler} from "express";

export function checkUserTicket(name: string): RequestHandler {
    return async function(req: Request, res, next) {
        /*
        if(!req.user) {
            res.status(401).end();
            return;
        }

        const user:User = req.user;
        for (let role of user.roles) {
            if (typeof role === "object" && role.name === name) {
                next();
                return;
            }
        }

        res.status(403).end();

         */
    }
}


export function verifyDate(year: number, month: number, day: number): Date {
    const date = new Date(year, month-1, day);

    if (isNaN(date.valueOf()) || date.getFullYear() !== year || date.getMonth()+1 !== month || date.getDate() !== day) {
        throw new Error("The input date is invalid");
    }

    const today = new Date();
    date.setHours(0,0,0,0);

    if (date < today) {
        throw new Error("The ticket is already expired");
    }
    return date;
}