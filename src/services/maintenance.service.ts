import { SecurityUtils } from '../utils';
import { Maintenance } from './../models/maintenance.model';
import { Request, Response } from 'express';
import { EnclosureService } from './enclosure.service';
import { MaintenanceLog } from '../models/maintenanceLog.model';
export class MaintenanceService {
    
    constructor() { }

    private static instance: MaintenanceService;

    public static getInstance(): MaintenanceService {
        if (!MaintenanceService.instance) {
            MaintenanceService.instance = new MaintenanceService();
        }

        return MaintenanceService.instance;
    }

    public async getAllMaintenances(req: Request, res: Response) {
        const maintenances = await Maintenance.find().populate('enclosure').exec();
        if (maintenances.length === 0) {
            res.status(404).json({ message: "No maintenances found" }).end();
            return;
        }

        res.json(maintenances).status(200).end();
    }

    public async getMaintenanceById(id: string) {
        return Maintenance.findById(id).populate('enclosure').exec();
    }

    public async registerMaintenance(req: Request, res: Response) {
        const { name, description } = req.body;
        const id = req.params.id;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (err) {
            res.status(400).json({ message: err?.toString() }).end();
            return;
        }

        if (!name || !description || !id) {
            res.status(400).json({ message: "Missing parameters" }).end();
            return;
        }

        if (!await EnclosureService.isEnclosureExist(id)) {
            res.status(404).json({ message: "Enclosure not found" }).end();
            return;
        }        

        const maintenance = new Maintenance({
            name: req.body.name,
            description: req.body.description,
            date: new Date(),
            enclosure: id 
        }); 

        const maintenanceLog = new MaintenanceLog({
            maintenance: maintenance._id,
            createdBy: req.user?.login,
            createdAt: new Date(),
            reason: req.body.description ? req.body.description : "No description"
        });

        await maintenanceLog.save();
        await maintenance.save();
        res.json(maintenance);
    }

    public async deleteMaintenanceById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (err) {
            res.status(400).json({ message: err?.toString() }).end();
            return;
        }
        
        const maintenance = await this.getMaintenanceById(id)
        if (maintenance) {     
            await Maintenance.deleteOne({ _id: id }).exec();
            const maintenanceLog = new MaintenanceLog({
                maintenance: id,
                deletedBy: req.user?.login,
                deletedAt: new Date(),
                reason: req.body.reason
            });
            await maintenanceLog.save();


            if (await this.getMaintenanceByIdHelper(id)) {
                res.status(400).end();
                return;
            }
    
            if (!await MaintenanceService.isMaintenanceExist(id)) {
                res.json({ message: `Maintenance ${id} deleted` }).status(200).end();
                return;
            }

            res.status(400).json({ message: "Maintenance not deleted" }).end();
        }else{
            res.status(404).json({ message: "Maintenance not found" }).end();
        } 
    }
 
    public async getMaintenancesByEnclosureId(req: Request, res: Response) {
        const id = req.params.id;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (err) {
            res.status(400).json({ message: err?.toString() }).end();
            return;
        }

        if (!await EnclosureService.isEnclosureExist(id)) {
            res.status(404).json({ message: "Enclosure not found" }).end();
            return;
        } 

        const maintenances = await Maintenance.find({ enclosure: id }).populate('enclosure').exec();
        res.json(maintenances);
    }

    public async updateMaintenance(req: Request, res: Response) {
        const id = req.params.id;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (err) {
            res.status(400).json({ message: err?.toString() }).end();
            return;
        }
        const maintenance = await this.getMaintenanceById(id)

        if (!maintenance) {
            res.status(404).json({ message: "Maintenance not found" }).end();
            return;
        }

        maintenance.name = req.body.name ? req.body.name : maintenance.name;
        maintenance.enclosure = req.body.enclosure ? req.body.enclosure : maintenance.enclosure;
        maintenance.date = req.body.date ? req.body.date : maintenance.date;
        maintenance.description = req.body.description ? req.body.description : maintenance.description;

        const updatedMaintenanceLog = {
            updatedBy: req.user?.login,
            updatedAt: new Date(),
            reason: req.body.reason ? req.body.reason : "No reason"
        };

        await MaintenanceLog.updateOne({ maintenance: maintenance._id }, { $set: updatedMaintenanceLog }).exec();
        await maintenance.save();
        res.json(maintenance).status(200).end();
    }


    private async getMaintenanceByIdHelper(id: string): Promise<typeof Maintenance.prototype | null> {
        return id ? await Maintenance.findById(id).exec() : null;
    }

    private async checkMaintenanceExistence(req: Request, res: Response): Promise<typeof Maintenance.prototype | null> {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
        }catch(err){
            res.status(400).json({ message: err?.toString() }).end();
            return null;
        }

        if (!req.params.id) {
            res.status(400).end();
            return null;
        }

        try {
            const maintenance = await this.getMaintenanceByIdHelper(req.params.id);
            if (!maintenance) {
                res.status(404).json({ message: "Maintenance not found" }).end();
                return null;
            }
            return maintenance;
        } catch (err) {
            res.status(500).end();
            return null;
        }
    }

    public static async isMaintenanceExist(id: string): Promise<boolean> {
        return id ? !!(await Maintenance.exists({ _id: id })) : false;
    }

}
