import mongoose, { Schema, Document } from 'mongoose';
import { IAnimal } from './animal.model';

export interface IEnclosure extends Document {
    name: string;
    description: string;
    maxCapacity: number;
    images: string[];
    type: string;
    duration: number;
    openingHours: string;
    accessibility: boolean;
    animals: IAnimal[];
    zooKeeper: string; // ID User ZooKeeper
}

const EnclosureSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    maxCapacity: { type: Number, required: true },
    images: { type: [String], required: false },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    openingHours: { type: String, required: true },
    accessibility: { type: Boolean, required: true },
    animals: [{ type: Schema.Types.ObjectId, ref: 'Animals' }], // ID Animal BDD
    zooKeeper: { type: Schema.Types.ObjectId, ref: 'User' }, // ID User BDD
});

export const Enclosure = mongoose.model<IEnclosure>('Enclosure', EnclosureSchema, 'Enclosures');
