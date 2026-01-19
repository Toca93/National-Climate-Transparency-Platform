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
import { CBTDto, CBTUpdateDto } from "../dtos/cbt.dto";
import { CBTService } from "../cbt/cbt.service";
import { CBTEntity } from "../entities/cbt.entity";
import { QueryDto } from "../dtos/query.dto";
import { DeleteDto } from "../dtos/delete.dto";

@ApiTags("CBT - Climate Finance")
@ApiBearerAuth()
@Controller("cbt")
export class CBTController {
  constructor(private readonly cbtService: CBTService) {}

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTEntity))
  @Post("add")
  addCBT(@Body() cbtDto: CBTDto, @Request() req) {
    return this.cbtService.createCBT(cbtDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTEntity, true))
  @Post("query")
  queryCBT(@Body() query: QueryDto, @Request() req) {
    return this.cbtService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTEntity, true))
  @Get("/:id")
  getCBTById(@Param("id") id: string, @Request() req) {
    return this.cbtService.getCBTById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTEntity))
  @Put("update")
  updateCBT(@Body() cbtUpdateDto: CBTUpdateDto, @Request() req) {
    return this.cbtService.updateCBT(cbtUpdateDto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTEntity))
  @Delete("delete")
  deleteCBT(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.cbtService.deleteCBT(deleteDto, req.user);
  }
}
