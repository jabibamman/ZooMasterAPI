import {Request, Response, Router} from "express";
import * as express from "express";
import { checkUserToken, checkUserRole } from "../middlewares";
import { EnclosureService } from "../services";
import { Roles } from "../utils";

export class EnclosureController {

    readonly path: string;
    private readonly enclosureService: EnclosureService;

    constructor() {
        this.path = "/enclosure";
        this.enclosureService = new EnclosureService();
    }

    async createEnclosure(req: Request, res: Response) {
        await this.enclosureService.createEnclosure(req, res);
    }

    async updateEnclosure(req: Request, res: Response) {
        await this.enclosureService.updateEnclosureById(req, res);
    }

    async getEnclosureById(req: Request, res: Response) {
        await this.enclosureService.getEnclosureById(req, res);
    }

    async addAnimalToEnclosure(req: Request, res: Response) {
        await this.enclosureService.addAnimalToEnclosure(req, res);
    }

    async removeAnimalFromEnclosure(req: Request, res: Response) {
        await this.enclosureService.removeAnimalFromEnclosure(req, res);
    }

    async getAnimalsInEnclosure(req: Request, res: Response) {
        await this.enclosureService.getAnimalsInEnclosure(req, res);
    }
 
    async deleteEnclosureById(req: Request, res: Response) {
        await this.enclosureService.deleteEnclosureById(req, res);
    }

    async getBestMonthForMaintenance(req: Request, res: Response) {        
        await this.enclosureService.getBestMonthForMaintenance(req, res);
    }


    buildRoutes(): Router {
        const router = express.Router();
        // Animal
        router.post('/:id/animal', express.json(), checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER,Roles.ADMIN]), this.addAnimalToEnclosure.bind(this));
        router.delete('/:id/animal/:animalId', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.removeAnimalFromEnclosure.bind(this));
        router.get('/:id/animal', checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.ADMIN]), this.getAnimalsInEnclosure.bind(this));
        // Enclosure
        router.post('/', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.createEnclosure.bind(this));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.updateEnclosure.bind(this));
        router.get('/:id', checkUserToken(), checkUserRole([Roles.ANIMAL_CARETAKER, Roles.VETERINARIAN, Roles.ADMIN]), this.getEnclosureById.bind(this));
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.ADMIN]), this.deleteEnclosureById.bind(this));
        // Maintenance
        router.get('/:id/best-month-for-maintenance', checkUserToken(), checkUserRole([Roles.ADMIN]), this.enclosureService.getBestMonthForMaintenance.bind(this.enclosureService));
        return router;
    }
}
