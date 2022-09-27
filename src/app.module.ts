import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GooglePlacesModule } from './google-places/google-places.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    UsersModule,
    AuthModule,
    GooglePlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
