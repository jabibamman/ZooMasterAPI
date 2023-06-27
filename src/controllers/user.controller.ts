import {Request, Response, Router} from "express";
import * as express from "express";
import { UserLoginDto, UserRegisterDto } from "../models";
import { checkUserToken, checkUserRole } from "../middlewares";
import { UserService } from "../services";
import { Roles } from "../utils";

export class UserController {

    readonly path: string;
    private userService: UserService;

    constructor() {
        this.path = "/user";
        this.userService = new UserService();
    }

    async register(req: Request, res: Response) {
        const user : UserRegisterDto = {
            login: req.body.login,
            password: req.body.password
        }

        return this.userService.register(user, res);
    }

    async login(req: Request, res: Response) {
        const user : UserLoginDto = {
            login: req.body.login,
            password: req.body.password,
            headers: req.headers
        }

        return this.userService.login(user, res);
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async admin(req: Request, res: Response) {
        await this.userService.admin(req, res);
    }

    async getUserById(req: Request, res: Response) {
        await this.userService.getUserById(req, res);
    }

    async putUserById(req: Request, res: Response) {
        await this.userService.putUserById(req, res);
    }

    async deleteUserById(req: Request, res: Response) {
        await this.userService.deleteUserById(req, res);
    }

    updateRole(req: Request, res: Response) {
         this.userService.updateRoles(req, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/register', express.json(), this.register.bind(this));
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', checkUserToken(), this.me.bind(this));
        router.get('/admin', checkUserToken(), checkUserRole([Roles.ADMIN]), this.admin.bind(this));
        router.get('/:id', checkUserToken(), checkUserRole([Roles.ADMIN]), this.getUserById.bind(this));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.putUserById.bind(this));
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.ADMIN]), this.deleteUserById.bind(this));
        router.put('/:id/role', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.updateRole.bind(this));
        return router;
    }
}