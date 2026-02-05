import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CBTEntity } from "../entities/cbt.entity";
import { CBTFundingEntity } from "../entities/cbt.funding.entity";
import { CBTInstrumentsEntity } from "../entities/cbt.instruments.entity";
import { CBTMacroEntity } from "../entities/cbt.macro.entity";
import { CBTView } from "../entities/cbt.view.entity";
import { CBTService } from "./cbt.service";
import { CBTFundingService } from "./cbt.funding.service";
import { CBTInstrumentsService } from "./cbt.instruments.service";
import { CBTMacroService } from "./cbt.macro.service";
import { UtilModule } from "../util/util.module";

@Module({
  imports: [TypeOrmModule.forFeature([CBTEntity, CBTFundingEntity, CBTInstrumentsEntity, CBTMacroEntity, CBTView]), UtilModule],
  providers: [CBTService, CBTFundingService, CBTInstrumentsService, CBTMacroService],
  exports: [CBTService, CBTFundingService, CBTInstrumentsService, CBTMacroService],
})
export class CBTModule {}
