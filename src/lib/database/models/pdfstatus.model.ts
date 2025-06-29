import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExplainJob extends Document {
  userId: string;
  pdfUrl: string;
  targetLanguage: string;
  voiceId: string;
  status: 'pending' | 'completed' | 'failed';
  extractedText?: string;
  generatedText?: string;
  translatedText?: string;
  audioUrl?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExplainJobSchema: Schema = new Schema<IExplainJob>(
  {
    userId:         { type: String, required: true },
    pdfUrl:         { type: String, required: true },
    targetLanguage: { type: String, required: true },
    voiceId:        { type: String, required: true },
    status:         { type: String, enum: ['pending','completed','failed'], default: 'pending' },
    extractedText:  { type: String },
    generatedText:  { type: String },
    translatedText: { type: String },
    audioUrl:       { type: String },
    error:          { type: String },
  },
  { timestamps: true }
);

export const ExplainJob: Model<IExplainJob> =
  mongoose.models.ExplainJob || mongoose.model<IExplainJob>('ExplainJob', ExplainJobSchema);
