import { Request, Response } from "express";
import { SecurityUtils } from "../utils";
import { ITreatmentRecord, TreatmentRecord } from "../models";
import { Model } from "mongoose";
import { EnclosureService } from "./enclosure.service";
export class TreatmentService {
    readonly model: Model<ITreatmentRecord>;
    readonly enclosureService: EnclosureService;

    constructor() { 
        this.model = TreatmentRecord;
        this.enclosureService = new EnclosureService();
    }

    async registerTreatment(req: Request, res: Response) {        
        try {            
            SecurityUtils.checkIfIdIsCorrect(req.body.animal);
            SecurityUtils.checkIfIdIsCorrect(req.body.veterinarian);
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        const treatment = new TreatmentRecord();
        treatment.animal = req.body.animal;
        treatment.veterinarian = req.body.veterinarian;
        treatment.date = new Date();
        treatment.description = req.body.description;
        treatment.medication = req.body.medication;
        treatment.enclosure = req.body.enclosure;
        try {
            const result = await treatment.save();
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error?.toString() });
        }

    }

    async getTreatmentById(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatment = await TreatmentRecord.findById(req.params.id);
            if (treatment) {
                res.json(treatment).status(200).end();
            } else {
                res.status(404).json({ error: "Treatment not found" });
            }
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    } 

    async putTreatmentById(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatment = await TreatmentRecord.findById(req.params.id);
            if (treatment) {
                treatment.animal = req.body.animal || treatment.animal;
                treatment.veterinarian = req.body.veterinarian || treatment.veterinarian;
                treatment.date = new Date();
                treatment.description = req.body.description || treatment.description;
                treatment.medication = req.body.medication || treatment.medication;
                treatment.enclosure = req.body.enclousure || treatment.enclosure;
                const result = await treatment.save();
                res.json(result).status(200).end();
            } else {
                res.status(404).json({ error: "Treatment not found" });
            }
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async deleteTreatmentById(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatment = await TreatmentRecord.findById(req.params.id);
            if (treatment) {
                await this.model.deleteOne({ _id: req.params.id }).exec();
                res.status(200).json({ message: "Treatment deleted" }).end();
            } else {
                res.status(404).json({ error: "Treatment not found" });
            }
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async getTreatments(req: Request, res: Response) {
        try {
            const treatments = await TreatmentRecord.find();
            res.json(treatments).status(200).end();
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async getTreatmentsByAnimalId(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatments = await TreatmentRecord.find({ animal: req.params.id });
            res.json(treatments).status(200).end();
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async getTreatmentsByVeterinarianId(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatments = await TreatmentRecord.find({ veterinarian: req.params.id });
            if (treatments.length === 0) {
                res.status(404).json({ error: "Veterinarian or treatments not found" });
                return;
            }
            res.json(treatments).status(200).end();
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async getTreatmentByEnclosureId(req: Request, res: Response) {
        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
            const treatments = await TreatmentRecord.find({ enclosure: req.params.id }).populate('animal').populate('veterinarian').exec();
    
            if (!treatments || treatments.length === 0) {
                res.status(404).json({ error: "No treatments found for this enclosure" });
                return; // Assurez-vous de retourner après avoir envoyé une réponse
            }
    
            res.json(treatments).status(200).end();
        }catch (error) {
            res.status(500).json({ error: error?.toString() });
        }

    }
}