import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CBTEntity } from "../entities/cbt.entity";
import { CBTService } from "./cbt.service";
import { UtilModule } from "../util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([CBTEntity]), UtilModule],
  providers: [CBTService],
  exports: [CBTService],
})
export class CBTModule {}
