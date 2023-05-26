import { AnimalModel, IAnimal, SpeciesModel } from "../models";
import {Request, Response} from "express";
import { Model } from "mongoose";

export class AnimalService {
    readonly model: Model<IAnimal>;

    constructor() {
        this.model = AnimalModel;
    }

    public async registerAnimal(req: Request, res: Response) {
        const speciesName = req.body.species;
        let species = await SpeciesModel.findOne({name: speciesName}).exec();
    
        if (!species) {
            species = new SpeciesModel({name: speciesName});
            await species.save();
        }
     
        const animal = new AnimalModel({
            name: req.body.name,
            age: req.body.age,
            healthStatus: req.body.healthStatus,
            species: species._id
        });
    
        await animal.save();
        res.json(animal);
    }
    

    public async getAnimalById(req: Request, res: Response) {
        const animal = await this.checkAnimalExistence(req, res);

        if (animal) res.json(animal);
    }

    public async putAnimalById(req: Request, res: Response) {
        const animal = await this.checkAnimalExistence(req, res);
    
        if (animal) {
            await animal.save();
            res.json(animal);
        }
    }

    public async deleteAnimalById(req: Request, res: Response) {
        const animal = await this.checkAnimalExistence(req, res);

        if (animal) {
            await this.model.deleteOne({ _id: req.params.id }).exec();
            res.json(animal);
            res.status(204).end();
        }
    }

    private async getAnimalByIdHelper(id: string): Promise<typeof AnimalModel.prototype | null> {
        return id ? await AnimalModel.findById(id).exec() : null;
    }

    private async checkAnimalExistence(req: Request, res: Response): Promise<typeof AnimalModel.prototype | null> {
        if (!req.params.id) {
            res.status(400).end();
            return null;
        }

        const animal = await this.getAnimalByIdHelper(req.params.id);
        if (!animal) {
            res.status(404).end();
        }

        return animal;
    }
}
