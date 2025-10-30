import { Schema, model, Document } from 'mongoose';

export interface INewsItem extends Document {
  title: string;
  createdAt: Date;
}

const NewsItemSchema = new Schema<INewsItem>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const NewsItem = model<INewsItem>('NewsItem', NewsItemSchema);
