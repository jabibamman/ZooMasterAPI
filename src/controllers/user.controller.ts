import {Request, Response, Router} from "express";
import * as express from "express";
import { UserLoginDto, UserRegisterDto } from "../models";
import { checkUserToken } from "../middlewares";
import { checkUserRole } from "../middlewares/role.middleware";
import { UserService } from "../services/user.service";

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
        this.userService.admin(req, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/register', express.json(), this.register.bind(this));
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', checkUserToken(), this.me.bind(this));
        router.get('/admin', checkUserToken(), checkUserRole("admin"), this.admin.bind(this))
        return router;
    }
}