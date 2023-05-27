import mongoose, { Schema, Document } from 'mongoose';
import { IAnimal } from './animal.model';
export interface IEnclosure extends Document {
    name: string;
    maxCapacity: number;
    animals: IAnimal[];
    zooKeeper: string; // ID User ZooKeeper
}

const EnclosureSchema: Schema = new Schema({
    name: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    animals: [{ type: Schema.Types.ObjectId, ref: 'Animals' }], // ID Animal BDD
    zooKeeper: { type: Schema.Types.ObjectId, ref: 'User' }, // ID User BDD
});

export const Enclosure = mongoose.model<IEnclosure>('Enclosure', EnclosureSchema, 'Enclosures');
