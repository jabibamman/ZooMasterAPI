import mongoose, {Schema, Document} from "mongoose";

export interface IAnimal extends Document {
  name: string;
  age: number;
  healthStatus: string;
  species: ISpecies["_id"];
}

export interface ISpecies extends Document {
  name: string;
  lifespan: number;
  diet: string;
  habitat: string;
}

const speciesSchema = new Schema<ISpecies>({
  name: { type: String, required: true },
  lifespan: { type: Number, required: true },
  diet: { type: String, required: true },
  habitat: { type: String, required: true }
});

const animalSchema = new Schema<IAnimal>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  healthStatus: { type: String, required: true },
  species: { type: mongoose.Schema.Types.ObjectId, ref: 'Species' }
});

const SpeciesModel = mongoose.model<ISpecies>('Species', speciesSchema, 'Species');
const AnimalModel = mongoose.model<IAnimal>('Animals', animalSchema, 'Animals');

export {AnimalModel, SpeciesModel};
