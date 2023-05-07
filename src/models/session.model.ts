import mongoose, {Model, Schema} from "mongoose";
import {User} from "./user.model";

const sessionSchema = new Schema<Session>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", // correspond au nom du model pour la jointure
        required: true
    },
    platform: {
        type: Schema.Types.String
    }
}, {
    versionKey: false,
    collection: "Sessions"
});

export interface Session {
    _id: string; // notre token
    user: string | User;
    platform?: string;
}

export const SessionModel: Model<Session> = mongoose.model("Session", sessionSchema);