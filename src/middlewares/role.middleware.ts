import {Request, RequestHandler} from "express";
import { User} from "../models";

export function checkUserRole(roles: string[]): RequestHandler {
    return async function(req: Request, res, next) {
        if(!req.user) {
            res.status(401).end();
            return;
        }

        const user:User = req.user;
        for (let role of user.roles) {
            if (typeof role === "object" && roles.includes(role.name)) {
                next();
                return;
            }
        }

        res.status(401).end();
    }
}