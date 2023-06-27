import { SpeciesModel, ISpecies } from "../models";
import {Request, Response} from "express";
import { Model } from "mongoose";
import { SecurityUtils } from "../utils";

export class SpeciesService {
    readonly model: Model<ISpecies>;

    constructor() {
        this.model = SpeciesModel;
    }

    public async registerSpecies(req: Request, res: Response) {
        if (!req.body.name || !req.body.lifespan || !req.body.diet || !req.body.habitat) {
            res.status(400).end();
            return;
        }

        const existingSpecies = await SpeciesModel.findOne({ name: req.body.species.name });
        if (existingSpecies) {
            res.status(400).json({ error: 'Species already exists' });
            return;
        }
    
        const species = new SpeciesModel(req.body.species);
        await species.save();
        res.json(species);
    }
    

    public async getSpeciesById(req: Request, res: Response) {
        const species = await this.checkSpeciesExistence(req, res);
        if (species) res.json(species);
    }

    public async putSpeciesById(req: Request, res: Response) {
        const species = await this.checkSpeciesExistence(req, res);

        if(species) {
            species.name = req.body.name ? req.body.name : species.name;
            species.lifespan = req.body.lifespan ? req.body.lifespan : species.lifespan;
            species.diet = req.body.diet ? req.body.diet : species.diet;
            species.habitat = req.body.habitat ? req.body.habitat : species.habitat;
            await species.save();
            res.json(species).status(200).end();
        }
        
    } 

    public async deleteSpeciesById(req: Request, res: Response) {
        const species = await this.checkSpeciesExistence(req, res);
        if (species) {
            await this.model.deleteOne({ _id: req.params.id }).exec();
            res.json(species);
            res.status(204).end();
        }
    }

    private async getSpeciesByIdHelper(id: string): Promise<typeof SpeciesModel.prototype | null> {
        return id ? await SpeciesModel.findById(id).exec() : null;
    }

    private async checkSpeciesExistence(req: Request, res: Response): Promise<typeof SpeciesModel.prototype | null> {
        if (!req.params.id) {
            res.status(400).end();
            return null;
        }

        try {
            SecurityUtils.checkIfIdIsCorrect(req.params.id);
        } catch (error) {
            res.status(400).json({message: error?.toString()}).end();
            return null;
        }

        
        const species = await this.getSpeciesByIdHelper(req.params.id);
        if (!species) {
            res.status(404).end();
        }

        return species;
    }
}
