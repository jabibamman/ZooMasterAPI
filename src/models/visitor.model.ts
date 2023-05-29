import mongoose, {Model, Schema} from "mongoose";

const visitorSchema = new Schema<Visitor>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        index: true,
        unique: true,
        required: true
    },
    ticketType: {
        type: Schema.Types.String,
        required: true
    }
}, {
    versionKey: false,
    collection: "Visitors"
});

export interface Visitor extends Document {
    name: string,
    email: string,
    ticketType: string;
}

export interface VisitorRequest {
    name: string,
    email: string,
    ticketType: string;
}

export const VisitorModel: Model<Visitor> = mongoose.model("Visitor", visitorSchema);
