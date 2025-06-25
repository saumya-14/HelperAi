import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChat extends Document {
  userId: string;
  question: string;
  generatedText: string;
  translatedText: string;
  audioUrl: string;
  audioCreatedAt: Date;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>({
  userId: { type: String, required: true },
  question: { type: String, required: true },
  generatedText: { type: String, required: true },
  translatedText: { type: String, required: true },
  audioUrl: { type: String, required: true },
  audioCreatedAt: { type: Date, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export const Chat: Model<IChat> = 
  mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);