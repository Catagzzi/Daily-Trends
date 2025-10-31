import { Schema, model, Document } from 'mongoose';

export interface INewsItem extends Document {
  title: string;
  link: string;
  description: string;
  author: string;
  place: string;
  source: string;
}

const NewsItemSchema = new Schema<INewsItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['EL_PAIS', 'EL_MUNDO'],
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NewsItem = model<INewsItem>('NewsItem', NewsItemSchema, 'feed');
