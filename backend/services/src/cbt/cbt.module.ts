import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CBTEntity } from "../entities/cbt.entity";
import { CBTFinanceNeededEntity } from "../entities/cbtFinanceNeeded.entity";
import { CBTFinanceReceivedEntity } from "../entities/cbtFinanceReceived.entity";
import { CBTTransparencyNeededEntity } from "../entities/cbtTransparencyNeeded.entity";
import { CBTTransparencyReceivedEntity } from "../entities/cbtTransparencyReceived.entity";
import { CBTService } from "./cbt.service";
import { CBTFinanceNeededService } from "./cbtFinanceNeeded.service";
import { CBTFinanceReceivedService } from "./cbtFinanceReceived.service";
import { CBTTransparencyNeededService } from "./cbtTransparencyNeeded.service";
import { CBTTransparencyReceivedService } from "./cbtTransparencyReceived.service";
import { UtilModule } from "../util/util.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CBTEntity,
      CBTFinanceNeededEntity,
      CBTFinanceReceivedEntity,
      CBTTransparencyNeededEntity,
      CBTTransparencyReceivedEntity,
    ]),
    UtilModule,
  ],
  providers: [
    CBTService,
    CBTFinanceNeededService,
    CBTFinanceReceivedService,
    CBTTransparencyNeededService,
    CBTTransparencyReceivedService,
  ],
  exports: [
    CBTService,
    CBTFinanceNeededService,
    CBTFinanceReceivedService,
    CBTTransparencyNeededService,
    CBTTransparencyReceivedService,
  ],
})
export class CBTModule {}
