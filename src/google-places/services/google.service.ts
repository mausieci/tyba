import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { RequestPlacesDto } from '../dto/google-request.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  RequestPlaces,
  RequestPlacesDocument,
} from '../model/googlePlaces.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
  private defaultLimit: number;

  constructor(
    @InjectModel(RequestPlaces.name)
    private RequestModel: Model<RequestPlacesDocument>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  /**
   * It receives a RequestPlacesDto object, which is a DTO (Data Transfer Object) that contains the
   * coordinates and radius of the search, and returns a list of places that match the search criteria
   * @param {RequestPlacesDto} data - RequestPlacesDto
   * @returns a promise with the data from the API call.
   */
  async findPlaces(data: RequestPlacesDto) {
    const { coordinates, radius } = data || {};
    const textQuery = 'textquery';
    const place = 'restaurant';
    const urlApi = `${process.env.GOOGLE_PLACES_URL}type=${place}&location=${coordinates}&radius=${radius}&inputtype=${textQuery}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    const config = {
      method: 'get',
      url: urlApi,
      headers: {},
    };

    const call = axios(config)
      .then(async function (response) {
        const dataToShow = response?.data?.results.map(
          ({ name, opening_hours, rating, geometry }) => ({
            name,
            opening_hours,
            rating,
            geometry,
          }),
        );

        return dataToShow;
      })
      .catch(function (error) {
        throw new BadRequestException(error);
      });

    const mockupToSaved = {
      ...data,
      results: call,
    };

    await this.savedRequest(mockupToSaved);
    return call;
  }

  /**
   * It takes in a data object, creates a new request using the RequestModel, and returns the saved
   * request
   * @param data - The data to be saved in the database.
   * @returns The saved request
   */
  async savedRequest(data) {
    try {
      const saved = this.RequestModel.create(data);
      return saved;
    } catch (error) {
      throw new BadRequestException('Not saved');
    }
  }

  /**
   * It returns a list of all requests, with a limit of 10 requests per page, and an offset of 0
   * @param paginationDto - This is the object that contains the limit and offset values.
   * @returns The RequestModel is being returned.
   */
  async listAllRequest(paginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.RequestModel.find().limit(limit).skip(offset);
  }
}
