

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDubbedVideo extends Document {
  userId?: string;
  originalVideoUrl: string;
  dubbedVideoUrl: string;
  extractedText: string;
  generatedText: string;
  translatedText: string;
  audioUrl: string;
  audioCreatedAt: Date;
  voiceId: string;
  locale: string;
  createdAt: Date;
}

const DubbedVideoSchema: Schema = new Schema<IDubbedVideo>({
  userId: { type: String, required: false }, 
  originalVideoUrl: { type: String, required: true },
  dubbedVideoUrl: { type: String, required: true },
  extractedText: { type: String, required: true },
  generatedText: { type: String, required: true },
  translatedText: { type: String, required: true },
  audioUrl: { type: String, required: true },
  audioCreatedAt: { type: Date, required: true },
  voiceId: { type: String, required: true },
  locale: { type: String, required: true },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

export const DubbedVideo: Model<IDubbedVideo> =
  mongoose.models.DubbedVideo || mongoose.model<IDubbedVideo>('DubbedVideo', DubbedVideoSchema);
