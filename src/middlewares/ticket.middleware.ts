import {Request, RequestHandler} from "express";
import {Pass} from "../utils";

export function checkUserTicket(name: string, start: Date, expiration: Date): RequestHandler {
    return async function(req: Request, res, next) {
        const today = new Date();
        if(start > today) {
            throw new Error("This ticket is not usable for now");
        }
        if(expiration < today) {
            throw new Error("This ticket is expired");
        }

        if (name == Pass.PASS_NIGHT) {
            if(today.getHours() < 21 || today.getHours() > 2) {
                throw new Error("You can't use this ticket at this hour")
            }
            return true;
        }
        if(today.getHours() < 9 || today.getHours() > 19) {
            throw new Error("You can't use this ticket at this hour")
        }
        if (name == Pass.PASS_DAYMONTH) {
            if(today.getMonth() + 1 > 11) {
                start = new Date(today.getFullYear() + 1, 0, 1);
                return true;
            }
            start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        }
        return true;
    }
}
