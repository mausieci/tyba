import { IsNumber, IsObject, IsString } from 'class-validator';

export class RequestModelDto {
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
