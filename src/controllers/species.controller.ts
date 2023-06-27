import {Request, Response, Router} from "express";
import * as express from "express";
import { checkUserToken, checkUserRole } from "../middlewares";
import { SpeciesService } from "../services";
import { Roles } from "../utils";

export class SpeciesController {

    readonly path: string;
    private speciesService: SpeciesService;

    constructor() {
        this.path = "/species";
        this.speciesService = new SpeciesService();
    }

    async registerSpecies(req: Request, res: Response) {
        await this.speciesService.registerSpecies(req, res);
    }

    async getSpeciesById(req: Request, res: Response) {
        await this.speciesService.getSpeciesById(req, res);
    }

    async putSpeciesById(req: Request, res: Response) {
        await this.speciesService.putSpeciesById(req, res);
    }

    async deleteSpeciesById(req: Request, res: Response) {
        await this.speciesService.deleteSpeciesById(req, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/', express.json(), checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.VETERINARIAN, Roles.ADMIN]), this.registerSpecies.bind(this));
        router.get('/:id', checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.VETERINARIAN, Roles.ADMIN]), this.getSpeciesById.bind(this));
        router.put('/:id',  express.json(), checkUserToken(),checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.putSpeciesById.bind(this));
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.deleteSpeciesById.bind(this));
        return router;
    }
}