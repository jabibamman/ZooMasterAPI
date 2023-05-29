import express = require("express");
import { checkUserRole, checkUserToken } from "../middlewares";
import { Roles } from "../utils";
import { TreatmentService } from "../services";
import { Request, Response } from "express";

export class TreatmentController {
    readonly path: string;
    private treatmentService: TreatmentService;

    constructor () {
        this.path = "/treatment";
        this.treatmentService = new TreatmentService();
    }

    async createTreatment(req: Request, res: Response) {
        this.treatmentService.registerTreatment(req, res);
    }
    
    async getTreatmentById(req: Request, res: Response) {
        this.treatmentService.getTreatmentById(req, res);
    }

    async putTreatmentById(req: Request, res: Response) {
        this.treatmentService.putTreatmentById(req, res);
    }

    async deleteTreatmentById(req: Request, res: Response) {
        this.treatmentService.deleteTreatmentById(req, res);
    }

    async getTreatmentByAnimalId(req: Request, res: Response) {
        this.treatmentService.getTreatmentsByAnimalId(req, res);
    }

    async getTreatmentByVeterinarianId(req: Request, res: Response) {
        this.treatmentService.getTreatmentsByVeterinarianId(req, res);
    }

    async getTreatmentByEnclosureId(req: Request, res: Response) {
        this.treatmentService.getTreatmentByEnclosureId(req, res);
    }

    async getTreatments(req: Request, res: Response) {
        this.treatmentService.getTreatments(req, res);
    }

    buildRoutes() {
        const router = express.Router();
        router.post('/', express.json(), checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.createTreatment.bind(this));
        router.get('/', checkUserToken(), checkUserRole([Roles.ADMIN]), this.getTreatments.bind(this));
        router.get('/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.getTreatmentById.bind(this));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.putTreatmentById.bind(this));
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.deleteTreatmentById.bind(this));
        router.get('/animal/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.getTreatmentByAnimalId.bind(this));
        router.get('/veterinarian/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.getTreatmentByVeterinarianId.bind(this));
        router.get('/enclosure/:id', checkUserToken(), checkUserRole([Roles.VETERINARIAN, Roles.ADMIN]), this.getTreatmentByEnclosureId.bind(this));
        return router;

    }
}