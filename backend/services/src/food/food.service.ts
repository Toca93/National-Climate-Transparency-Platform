import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodEntity } from '../entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(FoodEntity)
    private foodRepo: Repository<FoodEntity>,
  ) {}

  // Logic to save food to the database
  async create(data: any) {
    return await this.foodRepo.save(data);
  }

  // Logic to get all food
  async findAll() {
    return await this.foodRepo.find();
  }
}