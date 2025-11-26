import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { FoodService } from './food.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Food')
@ApiBearerAuth()
@Controller('food') // Creates URL: http://localhost:9000/food
export class FoodController {
  constructor(private readonly service: FoodService) {}

  @UseGuards(JwtAuthGuard) // Requires Login Token
  @Post('add')
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }
}