import {Request, Response} from "express";
import {AnimalModel, Enclosure, MaintenanceLog} from "../models";
import {SecurityUtils} from "../utils";
import mongoose from "mongoose";

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
                return enclosure;
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }

    }

    async updateEnclosureById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        try {
            const enclosure = await Enclosure.findById(id);
            if (enclosure) {
                enclosure.name = req.body.name || enclosure.name;
                enclosure.description = req.body.description || enclosure.description;
                enclosure.maxCapacity = req.body.maxCapacity || enclosure.maxCapacity;
                enclosure.images = req.body.images || enclosure.images;
                enclosure.type = req.body.type || enclosure.type;
                enclosure.duration = req.body.duration || enclosure.duration;
                enclosure.openingHours = req.body.openingHours || enclosure.openingHours;
                enclosure.accessibility = req.body.accessibility || enclosure.accessibility;
                enclosure.animals = req.body.animals || enclosure.animals;
                enclosure.zooKeeper = req.body.zooKeeper || enclosure.zooKeeper;
                await enclosure.save();
                res.status(200).json({ message: "Enclosure updated" });
            } else {
                res.status(404).json({ error: "Enclosure not found" });
            }
        } catch (error) {
            res.status(400).json({ error: error?.toString() });
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
            SecurityUtils.checkIfIdIsCorrect(id);
            SecurityUtils.checkIfIdIsCorrect(animalId);
        }catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        try {
            const enclosure = await Enclosure.findById(id);
            if (enclosure) {
                if (enclosure.animals.filter(animal => animal._id == animalId).length == 0) {
                    res.status(404).json({ error: "Animal not found in the enclosure" });
                    return;
                }

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
            SecurityUtils.checkIfIdIsCorrect(id);
        }catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

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

    async getBestMonthForMaintenance(req: Request, res: Response) {
        const { id } = req.params;
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        }catch (error) {
            res.status(400).json({ error: error?.toString() });
            return;
        }

        try {
            const bestMonthForRepairs = await this.determineBestMonth(id);            
            res.status(200).json(bestMonthForRepairs);
        } catch (error) {
            res.status(500).json({ error: error?.toString() });
        }
    }


    
    /* UTILS */
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

    static async isEnclosureExist(id: string) {
        try {
            SecurityUtils.checkIfIdIsCorrect(id);
        } catch (error) {
            return false;
        }
        return Enclosure.findById(id);
    }

    private async groupAndCountByMonth(enclosureId: string): Promise<{ _id: { month: number; year: number; }; count: number; }[]> {
        try {
            return await MaintenanceLog.aggregate([
                {$match: {enclosure: new mongoose.Types.ObjectId(enclosureId)}},
                {
                    $group: {
                        _id: {
                            month: {$month: "$createdAt"},
                            year: {$year: "$createdAt"}
                        },
                        count: {$sum: 1}
                    }
                },
                {$sort: {"_id.year": 1, "_id.month": 1}}
            ]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    

    private async determineBestMonth(enclosureId: string): Promise<{ bestMonth: string; maintenances: number; }[]> {
        try {
            const logsByMonth = await this.groupAndCountByMonth(enclosureId);
            const date = new Date();
            const currentYear = date.getFullYear();
            const possibleMonths = Array.from({length: 12}, (_, i) => ({month: i+1, year: currentYear}));
    
            const monthsWithNoMaintenance = possibleMonths.filter(m => !logsByMonth.find((log: { _id: { month: number; year: number; }; }) => log._id.month === m.month && log._id.year === m.year));

            if(monthsWithNoMaintenance.length > 0) {
                return monthsWithNoMaintenance.map(m => ({ bestMonth: `${m.month}-${m.year}`, maintenances: 0 }));
            }

            let minCount = Infinity;
            let bestMonths: { bestMonth: string; maintenances: number; }[] = [];
    
            for (let log of logsByMonth) {                    
                if (log.count < minCount) {                        
                    minCount = log.count;
                    bestMonths = [{ bestMonth: `${log._id.month}-${log._id.year}`, maintenances: minCount }];
                } else if (log.count === minCount) {
                    bestMonths.push({ bestMonth: `${log._id.month}-${log._id.year}`, maintenances: minCount });
                }
            }
    
            return bestMonths;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
