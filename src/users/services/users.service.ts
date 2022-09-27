import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dto';
import { User, UserDocument } from '../model';

@Injectable()
export class UsersService {
  private defaultLimit: number;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  /**
   * It finds all users in the database, limits the number of users to the limit passed in the
   * paginationDto, skips the number of users specified in the offset, and sorts the users by name
   * @param paginationDto - This is the object that contains the limit and offset values.
   * @returns An array of objects with the name and email of each user.
   */
  async findAll(paginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    const usersToFound = await this.userModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ name: 1 });

    const usersList = usersToFound.map(({ name, email }) => ({ name, email }));

    return usersList;
  }

  /**
   * It finds a user by id and returns it
   * @param {string} id - string - The id of the user we want to find.
   * @returns The userFound object
   */
  async findOne(id: string) {
    const userFound = await this.userModel.findById(id);

    if (!userFound) throw new NotFoundException('User not found');

    return userFound;
  }

  /**
   * We're going to find a user by their id, then update the user with the new data
   * @param {string} id - string - The id of the user we want to update.
   * @param {UpdateUserDto} _updateUserDto - UpdateUserDto - This is the DTO that we created earlier.
   * @returns return { ...user.toJSON(), ..._updateUserDto };
   */
  async update(id: string, _updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user.email) _updateUserDto.name = _updateUserDto.name;

    try {
      await user.updateOne(_updateUserDto);
      return { ...user.toJSON(), ..._updateUserDto };
    } catch (err) {
      throw new InternalServerErrorException(
        `Cant updated User - Check server log`,
      );
    }
  }

  /**
   * It removes a user from the database by its id
   * @param {string} id - string - the id of the user to be deleted
   * @returns A string
   */
  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new BadRequestException(`User with id ${id} not found`);

    return `User was removed`;
  }
}
