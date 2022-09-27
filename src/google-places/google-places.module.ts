import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleController } from './controllers/google.controller';
import { googleSchema, RequestPlaces } from './model/googlePlaces.schema';
import { GoogleService } from './services/google.service';

@Module({
  providers: [GoogleService],
  controllers: [GoogleController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: RequestPlaces.name,
        schema: googleSchema,
      },
    ]),
  ],
})
export class GooglePlacesModule {}
