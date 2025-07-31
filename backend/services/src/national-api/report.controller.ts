import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
	Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { Action } from "../casl/action.enum";
import { PoliciesGuardEx } from "../casl/policy.guard";
import { QueryDto } from "../dtos/query.dto";
import { SupportEntity } from "../entities/support.entity";
import { ReportService } from "../report/report.service";
import { DataExportQueryDto } from "../dtos/data.export.query.dto";
import { Annexes, Reports } from "../enums/shared.enum";

@ApiTags("Reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
  ) {}

	@ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, SupportEntity, true))
  @Post(":annexNumber/:tableNumber/query")
  async queryReportFiveData(@Param('annexNumber') annexNumber: Annexes, @Param('tableNumber') tableNumber: Reports, @Body() query: QueryDto, @Request() req) {
    return await this.reportService.getTableData(annexNumber,tableNumber, query);
  }

	@ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, SupportEntity, true))
  @Post(":annexNumber/:tableNumber/export")
  exportReportFiveData(@Param('annexNumber') annexNumber: Annexes, @Param('tableNumber') tableNumber: Reports, @Body() query: DataExportQueryDto, @Request() req) {
    return this.reportService.downloadReportData(annexNumber, tableNumber, query);
  }

}