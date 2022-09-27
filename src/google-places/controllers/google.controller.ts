import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JwtGuardGuard } from 'src/guards';
import { RequestPlacesDto } from '../dto/google-request.dto';
import { GoogleService } from '../services/google.service';

@ApiBearerAuth()
@ApiTags('googlePlaces')
//@UseGuards(JwtGuardGuard)
@Controller('google')
export class GoogleController {
  constructor(private readonly googlePlacesSvc: GoogleService) {}

  @Post('find-places')
  findPlaces(@Body() requestPlacesDto: RequestPlacesDto) {
    return this.googlePlacesSvc.findPlaces(requestPlacesDto);
  }

  @Get()
  listRequest(@Query() paginationDto: PaginationDto) {
    this.googlePlacesSvc.listAllRequest(paginationDto);
  }
}
