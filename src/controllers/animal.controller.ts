import {Request, Response, Router} from "express";
import * as express from "express";
import { checkUserToken, checkUserRole } from "../middlewares";
import { AnimalService } from "../services";
import { Roles } from "../utils";

export class AnimalController {

    readonly path: string;
    private animalService: AnimalService;

    constructor() {
        this.path = "/animal";
        this.animalService = new AnimalService();

    }

    async registerAnimal(req: Request, res: Response) {
        await this.animalService.registerAnimal(req, res);
    }

    async getAnimalById(req: Request, res: Response) {
        await this.animalService.getAnimalById(req, res);
    }

    async putAnimalById(req: Request, res: Response) {
        await this.animalService.putAnimalById(req, res);
    }

    async deleteAnimalById(req: Request, res: Response) {
        await this.animalService.deleteAnimalById(req, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/', express.json(), checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.VETERINARIAN, Roles.ADMIN]), this.registerAnimal.bind(this));
        router.get('/:id', checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.VETERINARIAN, Roles.ADMIN]), this.getAnimalById.bind(this));
        router.put('/:id',  express.json(), checkUserToken(),checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.putAnimalById.bind(this));
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.deleteAnimalById.bind(this));
        return router;
    }
}