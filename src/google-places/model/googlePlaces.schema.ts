import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class RequestPlaces {
  _id: string;
  coordinates: string;
  radius: number;
  results: [
    {
      name: string;

      rating: number;

      geometry: string;
    },
  ];
}

export const googleSchema = SchemaFactory.createForClass(RequestPlaces);
export type RequestPlacesDocument = RequestPlaces & Document;
