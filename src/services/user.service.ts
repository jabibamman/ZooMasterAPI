import { Role, RoleModel, SessionModel, User, UserLoginDto, UserModel, UserRegisterDto } from "../models";
import {Request, Response} from "express";
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
                console.log(me)
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
        res.json({
            token: session._id
        });

    }

    public async admin(req: Request, res: Response) {
        const users = await UserModel.find().exec();
        res.json(users);
    }
    
    public async getUserById(req: Request, res: Response) {
        const id = req.params.id;
        const user = await this.getUserByIdHelper(id);
    
        if (!user) {
            res.status(404).end();
            return;
        }
    
        res.json(user);
    }

    public async putUserById(req: Request, res: Response) {
        const id = req.params.id;
        const user = await this.getUserByIdHelper(id);
    
        if (!user) {
            res.status(404).end();
            return;
        }
    
        if (typeof req.body.login === "string" && req.body.login.length > 4) {
            user.login = req.body.login;
        }
    
        if (typeof req.body.password === "string" && req.body.password.length > 8) {
            user.password = SecurityUtils.toSHA512(req.body.password);
        }        
    
        await user.save();
        res.json(user);
    }

    public async deleteUserById(req: Request, res: Response) {
        const id = req.params.id;
        const user = await this.getUserByIdHelper(id);

        if (!user) {
            res.status(404).end();
            return;
        }
 
        await this.model.deleteOne({ _id: id }).exec();
        res.json(user);
        res.status(204).end();
    }
    

    /* Usage only in user service */
    private async loadGuestRole(): Promise<void> {
        if(this.guestRole) {
            return;
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec();
    }

    private async getUserByIdHelper(id: string): Promise<typeof UserModel.prototype | null> {
        if (!id) {
            return null;
        }
        return await UserModel.findById(id).exec();
    }
    

}
 