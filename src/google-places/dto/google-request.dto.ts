import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class RequestPlacesDto {
  @IsString()
  coordinates: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  radius: number;
}
