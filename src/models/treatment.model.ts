import mongoose, { Schema, Document } from 'mongoose';
import { IAnimal } from './animal.model';
import { User } from './user.model';
import { IEnclosure } from './enclosure.model';

export interface IMedication {
  name: string;
  dosage: string;
}

export interface ITreatmentRecord extends Document {
  date: Date;
  description: string;
  medication: IMedication[];
  animal: IAnimal["_id"];
  veterinarian: User["login"];
  enclosure: IEnclosure["_id"];
}

const MedicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true }
}, { _id : false });

export const TreatmentRecordSchema: Schema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  medication: [MedicationSchema],
  animal: { type: Schema.Types.ObjectId, ref: 'Animals' },
  veterinarian: { type: Schema.Types.ObjectId, ref: 'User' },
  enclosure: { type: Schema.Types.ObjectId, ref: 'Enclosure' }
});

export const TreatmentRecord = mongoose.model<ITreatmentRecord>('TreatmentRecord', TreatmentRecordSchema, 'TreatmentRecords');
