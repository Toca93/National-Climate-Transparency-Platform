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
import { CBTInstrumentsDto, CBTInstrumentsUpdateDto } from "../dtos/cbt.instruments.dto";
import { CBTInstrumentsService } from "../cbt/cbt.instruments.service";
import { CBTInstrumentsEntity } from "../entities/cbt.instruments.entity";
import { QueryDto } from "../dtos/query.dto";
import { DeleteDto } from "../dtos/delete.dto";

@ApiTags("CBT Instruments - Climate Finance Financial Instruments")
@ApiBearerAuth()
@Controller("cbt-instruments")
export class CBTInstrumentsController {
  constructor(private readonly cbtInstrumentsService: CBTInstrumentsService) {}

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTInstrumentsEntity))
  @Post("add")
  addCBTInstruments(@Body() cbtInstrumentsDto: CBTInstrumentsDto, @Request() req) {
    return this.cbtInstrumentsService.createCBTInstruments(cbtInstrumentsDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTInstrumentsEntity, true))
  @Post("query")
  queryCBTInstruments(@Body() query: QueryDto, @Request() req) {
    return this.cbtInstrumentsService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTInstrumentsEntity, true))
  @Get("/:id")
  getCBTInstrumentsById(@Param("id") id: string, @Request() req) {
    return this.cbtInstrumentsService.getCBTInstrumentsById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTInstrumentsEntity))
  @Put("update")
  updateCBTInstruments(@Body() cbtInstrumentsUpdateDto: CBTInstrumentsUpdateDto, @Request() req) {
    return this.cbtInstrumentsService.updateCBTInstruments(cbtInstrumentsUpdateDto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTInstrumentsEntity))
  @Delete("delete")
  deleteCBTInstruments(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.cbtInstrumentsService.deleteCBTInstruments(deleteDto, req.user);
  }
}
