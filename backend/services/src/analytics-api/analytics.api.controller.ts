import {
  Controller,
  UseGuards,
  Get,
  Query,
	Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.api.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CBTTypeOfSupport } from "../entities/cbt.entity";

@ApiTags("Analytics")
@ApiBearerAuth('api_key')
@Controller("analytics")
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/actionsSummery')
  getClimateActionChart() {
    return this.analyticsService.getClimateActionChart();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/projectSummary')
  getProjectSummaryChart() {
    return this.analyticsService.getProjectSummaryChart();
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportSummary')
  getSupportChart() {
    return this.analyticsService.getActivitiesSupported();
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportFinanceSummary')
  getSupportFinanceChart() {
    return this.analyticsService.getActivitiesFinance();
  }

	@UseGuards(JwtAuthGuard)
  @Get('/ghgMitigationSummaryForYear/:year')
  getGhgMitigationForYear(@Param('year') year: number) {
    return this.analyticsService.getGhgMitigationForYear(year);
  }

	@UseGuards(JwtAuthGuard)
  @Get('/getGhgMitigationSummary')
  getGhgMitigationForRecentYear() {
    return this.analyticsService.getGhgMitigationForRecentYear();
  }

	// New endpoints for CBT-related pie charts with typeOfSupport filter

	@UseGuards(JwtAuthGuard)
  @Get('/supportByType')
  getSupportByTypeChart(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getSupportByTypeChart(typeOfSupport);
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportByActivityStatus')
  getSupportByActivityStatusChart(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getSupportByActivityStatusChart(typeOfSupport);
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportByETFSector')
  getSupportByETFSectorChart(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getSupportByETFSectorChart(typeOfSupport);
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportByFinancialInstrument')
  getSupportByFinancialInstrumentChart(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getSupportByFinancialInstrumentChart(typeOfSupport);
  }

	@UseGuards(JwtAuthGuard)
  @Get('/supportByFinancingChannel')
  getSupportByFinancingChannelChart(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getSupportByFinancingChannelChart(typeOfSupport);
  }

	// Batch endpoint for all 5 support charts - returns all data in one request
	@UseGuards(JwtAuthGuard)
  @Get('/supportChartsBatch')
  getAllSupportCharts(@Query('typeOfSupport') typeOfSupport?: CBTTypeOfSupport) {
    return this.analyticsService.getAllSupportCharts(typeOfSupport);
  }
}
