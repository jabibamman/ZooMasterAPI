import mongoose, { Schema, Document } from 'mongoose';
import { IMaintenance } from './maintenance.model';
import { User } from './user.model';

export interface IMaintenanceLog extends Document {
    maintenance: IMaintenance["_id"];
    deletedAt: Date;
    deletedBy: User["login"];
    updatedBy: User["login"];
    createdBy: User["login"];
    createdAt: Date;
    updatedAt: Date;
    reason: string;
}

const MaintenanceLogSchema: Schema = new Schema({
    maintenance: { type: Schema.Types.ObjectId, ref: 'Maintenance', required: true },
    deletedAt: { type: Date, required: false },
    deletedBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
    updatedAt: { type: Date, required: false },
    createdBy: { type: String, required: false },
    createdAt: { type: Date, required: false },
    reason: { type: String, default: "No reason" }
});

export const MaintenanceLog = mongoose.model<IMaintenanceLog>('MaintenanceLog', MaintenanceLogSchema, 'MaintenanceLogs');
