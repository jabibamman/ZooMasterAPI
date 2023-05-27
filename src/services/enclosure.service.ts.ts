import { Request, Response } from "express";
import { Enclosure } from "../models/enclosure.model";
import { AnimalModel } from "../models/animal.model";
import { SecurityUtils } from "../utils";

export class EnclosureService {
    async createEnclosure(req: Request, res: Response) {
        const newEnclosure = new Enclosure(req.body);
        try {
            await this.validateAnimals(req.body.animals, res);
        } catch (error) {
            return;
        } 
        
        try {
            const result = await newEnclosure.save();
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
        }
    }

    async getEnclosureById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const enclosure = await Enclosure.findById(id);
            if (enclosure) {
                res.json(enclosure);
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async addAnimalToEnclosure(req: Request, res: Response) {
        const { id } = req.params; 
        const animalsId  = req.body.animals;

        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        }catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        const enclosure = await Enclosure.findById(id);
        try {                        
            await this.validateAnimals(animalsId, res);
        } catch (error) {
            return;
        } 

        try {
            for (let id of animalsId) {                                
                const animal = await AnimalModel.findById(id);
                if (!animal) {
                    res.status(404).json({ error: "Animal not found" });
                    return;
                }
 
                if (enclosure && animal) {
                    enclosure.animals.push(id);
                    await enclosure.save();
                    res.status(200).json({ message: "Animal added to the enclosure" });
                } else {
                    res.status(404).json({ error: "Enclosure or animal not found" });
                }
            }
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
        }
    }

    async removeAnimalFromEnclosure(req: Request, res: Response) {
        const { id, animalId } = req.params; 
        try {
            const enclosure = await Enclosure.findById(id);
            if (enclosure) {
                enclosure.animals = enclosure.animals.filter(animal => animal._id != animalId);
                await enclosure.save();
                res.status(200).json({ message: "Animal removed from the enclosure" });
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async getAnimalsInEnclosure(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const enclosure = await Enclosure.findById(id).populate('animals');
            if (enclosure) {
                res.json(enclosure.animals);
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    async deleteEnclosureById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await Enclosure.findByIdAndDelete(id);
            if (result) {
                res.status(200).json({ message: "Enclosure deleted successfully" });
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }

    private async validateAnimals(animals: string[], res?: Response) {    
        for (const element of animals) {
            try {
                SecurityUtils.checkIfIdIsCorrect(element);
            } catch (error) {
                res?.status(400).json({ error: error?.toString() });
                throw new Error(error?.toString());
            }

            const animal = await AnimalModel.findById(element);
            if (!animal) {
                res?.status(404).json({ error: "Animal not found" });
                throw new Error("Animal not found");
            }
            const enclosure = await Enclosure.findOne({ animals: { $in: [element] } });
            if (enclosure) {
                res?.status(400).json({ error: "Animal already in another enclosure or in this enclosure !" });
                throw new Error("Animal already in another enclosure or in this enclosure !");
            }
        }
    }
}
