import { MaintenanceService } from './../services/maintenance.service';
import {Request, Response, Router} from "express";
import * as express from "express";
import { checkUserToken } from "../middlewares";
import { checkUserRole } from "../middlewares/role.middleware";
import { Roles } from "../utils";

export class MaintenanceController {

    readonly path: string;
    private maintenanceService: MaintenanceService;

    constructor() {
        this.path = "/maintenance";
        this.maintenanceService = new MaintenanceService();
    }

    async getAllMaintenance(req: Request, res: Response) {
        this.maintenanceService.getAllMaintenances(req, res);
    }

    async createMaintenance(req: Request, res: Response) {
        this.maintenanceService.registerMaintenance(req, res);
    }

    async deleteMaintenance(req: Request, res: Response) {
        this.maintenanceService.deleteMaintenanceById(req, res);
    }

    async updateMaintenance(req: Request, res: Response) {
        this.maintenanceService.updateMaintenance(req, res);
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/enclosure/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.maintenanceService.registerMaintenance.bind(this.maintenanceService));
        router.get('/enclosure/:id', checkUserToken(), checkUserRole([Roles.ADMIN]), this.maintenanceService.getMaintenancesByEnclosureId.bind(this.maintenanceService));
        router.get('/enclosure', checkUserToken(), checkUserRole([Roles.ADMIN]), this.maintenanceService.getAllMaintenances.bind(this.maintenanceService)); 
        router.delete('/:id', checkUserToken(), checkUserRole([Roles.ADMIN]), this.maintenanceService.deleteMaintenanceById.bind(this.maintenanceService));
        router.put('/:id', express.json(), checkUserToken(), checkUserRole([Roles.ADMIN]), this.maintenanceService.updateMaintenance.bind(this.maintenanceService));
        
       return router;
    }
}
