import { Role, RoleModel, SessionModel, User, UserLoginDto, UserModel, UserRegisterDto } from "../models";
import {Request, Response, Router} from "express";
import { SecurityUtils } from "../utils";
import { Model } from "mongoose";


export class UserService {
    guestRole: Role | null;
    readonly model: Model<User>;

    constructor() {
        this.guestRole = null;
        this.model = UserModel;
    }

    public async register(user: UserRegisterDto, res : Response) {
        if(!user) {
            res.status(400).end();
            return;
        }
        if(typeof user.login !== "string" || user.login.length < 4) {
            res.status(400).end();
            return;
        }
        if(typeof user.password !== "string" || user.password.length < 8) {
            res.status(400).end();
            return;
        }

        const login: string = user.login;
        const password: string = user.password;

        try {
            await this.loadGuestRole();
            const user = await UserModel.create({
                login,
                password: SecurityUtils.toSHA512(password),
                roles: [this.guestRole]
            });
            res.json(user);
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end(); // conflict
            } else {
                res.status(500).end(); // internal_server_error
            }
        }
    }

    public async login(user: UserLoginDto, res: Response) {
        if(!user || typeof user.login !== "string" || typeof user.password !== "string") {
            res.status(400).end();
            return;
        }
        const newUser = await UserModel.findOne({
            login: user.login,
            password: SecurityUtils.toSHA512(user.password)
        });
        const platform = user.headers['user-agent'];
        const session = await SessionModel.create({
            user: newUser,
            platform: platform
        });
        // on retourne à l'utilisateur uniquement le token de la session.
        res.json({
            token: session._id
        });

    }

    public async admin(req: Request, res: Response) {
        const users = await UserModel.find().exec();
        res.json(users);
    }

    private async loadGuestRole(): Promise<void> {
        if(this.guestRole) {
            return;
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec();
    }

}
 