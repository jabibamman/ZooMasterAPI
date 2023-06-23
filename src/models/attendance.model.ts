import mongoose, {Model, Schema} from "mongoose";

const attendanceSchema = new Schema<Attendance>({
    date: {
        type: Schema.Types.Date,
        required: true
    },
    rate: {
        type: Schema.Types.Number,
        required: true,
    }
}, {
    versionKey: false,
    collection: "Attendance"
});

export interface Attendance {
    date: Date,
    rate: number
}

export interface AttendanceRequest {
    date: Date,
    rate: number
}

export const AttendanceModel: Model<Attendance> = mongoose.model("Attendance", attendanceSchema);
