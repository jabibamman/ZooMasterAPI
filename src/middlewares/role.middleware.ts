import { Role } from './../models/role.model';
import {Request, RequestHandler} from "express";
import {SessionModel, User} from "../models";

export function checkUserRole(name:string): RequestHandler {
    return async function(req: Request, res, next) {
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

    }
}