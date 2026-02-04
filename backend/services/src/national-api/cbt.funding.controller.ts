import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Action } from "../casl/action.enum";
import { PoliciesGuardEx } from "../casl/policy.guard";
import { CBTFundingDto, CBTFundingUpdateDto } from "../dtos/cbt.funding.dto";
import { CBTFundingService } from "../cbt/cbt.funding.service";
import { CBTFundingEntity } from "../entities/cbt.funding.entity";
import { QueryDto } from "../dtos/query.dto";
import { DeleteDto } from "../dtos/delete.dto";

@ApiTags("CBT Funding - Climate Finance Funding Sources")
@ApiBearerAuth()
@Controller("cbt-funding")
export class CBTFundingController {
  constructor(private readonly cbtFundingService: CBTFundingService) {}

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTFundingEntity))
  @Post("add")
  addCBTFunding(@Body() cbtFundingDto: CBTFundingDto, @Request() req) {
    return this.cbtFundingService.createCBTFunding(cbtFundingDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFundingEntity, true))
  @Post("query")
  queryCBTFunding(@Body() query: QueryDto, @Request() req) {
    return this.cbtFundingService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFundingEntity, true))
  @Get("/:id")
  getCBTFundingById(@Param("id") id: string, @Request() req) {
    return this.cbtFundingService.getCBTFundingById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTFundingEntity))
  @Put("update")
  updateCBTFunding(@Body() cbtFundingUpdateDto: CBTFundingUpdateDto, @Request() req) {
    return this.cbtFundingService.updateCBTFunding(cbtFundingUpdateDto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTFundingEntity))
  @Delete("delete")
  deleteCBTFunding(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.cbtFundingService.deleteCBTFunding(deleteDto, req.user);
  }
}
