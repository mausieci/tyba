import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/model';
import { LoginAuthDto, RegisterAuthDto } from '../dto';
import { compareHash, generateHash } from '../utils/handleBCrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * It takes in a userData object, destructures it, hashes the password, and then creates a new user
   * with the hashed password
   * @param {RegisterAuthDto} userData - RegisterAuthDto - This is the data that is passed in from the
   * controller.
   * @returns The new user that was created.
   */
  async register(userData: RegisterAuthDto) {
    const { password, ...user } = userData;

    const userParse = {
      ...user,
      password: await generateHash(password),
    };

    const newUser = await this.userModel.create(userParse);

    return newUser;
  }

  /**
   * The function takes in a userLoginData object, which is a LoginAuthDto, and returns a Promise that
   * resolves to a data object
   * @param {LoginAuthDto} userLoginData - LoginAuthDto
   * @returns The token and the user data
   */
  async login(userLoginData: LoginAuthDto) {
    const { password, email } = userLoginData;
    const userExist = await this.userModel.findOne({ email });

    if (!userExist)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isCheck = await compareHash(password, userExist.password);

    if (!isCheck)
      throw new HttpException('Password Invalid', HttpStatus.FORBIDDEN);

    const userFlat = userExist.toObject();
    delete userFlat.password;

    const payload = {
      id: userFlat._id,
      name: userFlat.name,
      email: userFlat.email,
    };

    const token = this.jwtService.sign(payload);

    const data = {
      token,
      user: userFlat,
    };

    return data;
  }
}
