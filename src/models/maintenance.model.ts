import mongoose, { Schema, Document } from 'mongoose';
import { IEnclosure } from './enclosure.model';
export interface IMaintenance extends Document {
    name: string;
    description: string; 
    date: Date;
    enclosure: IEnclosure["_id"];
}



const EnclosureSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: false },
    enclosure: { type: Schema.Types.ObjectId, ref: 'Enclosure' }
});

export const Maintenance = mongoose.model<IMaintenance>('Maintenance', EnclosureSchema, 'Maintenances');
