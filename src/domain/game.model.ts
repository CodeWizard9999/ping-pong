import mongoose, { Schema, Document } from 'mongoose';

interface Game {
  player_1: string,
  player_2: string,
  player_1_score: number,
  player_2_score: number,
  rounds_story: string[]
}

const gameSchema = new Schema<Game>(
  {
    player_1: {
      type: String,
      trim: true,
      required: true
    },
    player_2: {
      type: String,
      trim: true,
      required: true
    },
    player_1_score: {
      type: Number,
      required: true,
    },
    player_2_score: {
      type: Number,
      required: true,
    },
    rounds_story: {
      type: [String],
      required: true
    }
  }
);

export type CourseDocument = Game & Document;
export default mongoose.model<CourseDocument>('Game', gameSchema);
