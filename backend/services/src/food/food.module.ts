import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodEntity } from '../entities/food.entity';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodEntity])], // This line connects the Database Table
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}