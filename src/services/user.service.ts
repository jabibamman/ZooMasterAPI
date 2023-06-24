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
            res.json(user).end();
        } catch(err: unknown) {
            const me = err as {[key: string]: unknown};
            if(me["name"] === 'MongoServerError' && me["code"] === 11000) {
                res.status(409).end();
            } else {
                console.log(me, "\nERROR ", me["code"])
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

        if(!newUser) {
            res.status(401).end();
            return;
        }

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
        if (!id) {
            res.status(404).end();
            return;
        }
        try {
            await this.model.deleteOne({ _id: id }).exec();
            res.json({ message: "User deleted" }).status(204).end();
        }
        catch (err: unknown) {
            res.status(404).end();
        }
    }

    public async updateRoles(req: Request, res: Response) {
        const id = req.params.id;
        const user = await this.getUserByIdHelper(id);

        if (!user) {
            res.status(404).json({ message: "User not found" }).end();
            return;
        }

        const role = await RoleModel.findOne({ name: req.body.roles.toLowerCase() }).exec();

        if (!role) {
            res.status(404).json({ message: "Role not found" }).end();
            return;
        }
        
        user.roles.push(role);
        await user.save();
        res.status(200).json(user).end();
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

    public async getUserByIdHelper(id: string): Promise<typeof UserModel.prototype | null> {
        if (!id) {
            return null;
        }
        try {
            return await UserModel.findById(id).exec();
        }
        catch (err: unknown) {
            return null;
        }
    }
}