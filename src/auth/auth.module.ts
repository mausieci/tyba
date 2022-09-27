import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/model';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtHandle } from './utils';

@Module({
  providers: [AuthService, JwtStrategy, JwtHandle],
  controllers: [AuthController],
  exports: [JwtHandle],
  imports: [
    EventEmitter2,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          signOptions: { expiresIn: '3d' },
          secret: process.env.JWT_SECRET,
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class AuthModule {}
