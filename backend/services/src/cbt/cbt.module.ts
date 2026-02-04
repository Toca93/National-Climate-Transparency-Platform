import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CBTEntity } from "../entities/cbt.entity";
import { CBTFundingEntity } from "../entities/cbt.funding.entity";
import { CBTService } from "./cbt.service";
import { CBTFundingService } from "./cbt.funding.service";
import { UtilModule } from "../util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([CBTEntity, CBTFundingEntity]), UtilModule],
  providers: [CBTService, CBTFundingService],
  exports: [CBTService, CBTFundingService],
})
export class CBTModule {}
