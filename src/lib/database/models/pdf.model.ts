import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPDF extends Document {
  userId: string;
  pdfUrl: string;
  generatedText: string;
  translatedText: string;
  audioUrl: string;
  audioCreatedAt: Date;
  createdAt: Date;
}

const PDFSchema: Schema = new Schema<IPDF>(
  {
    userId: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    generatedText: { type: String, required: true },
    translatedText: { type: String, required: true },
    audioUrl: { type: String, required: true },
    audioCreatedAt: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

export const PDF: Model<IPDF> = mongoose.models.PDF || mongoose.model<IPDF>('PDF', PDFSchema);
