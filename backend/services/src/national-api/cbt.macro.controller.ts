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
import { CBTMacroDto, CBTMacroUpdateDto } from "../dtos/cbt.macro.dto";
import { CBTMacroService } from "../cbt/cbt.macro.service";
import { CBTMacroEntity } from "../entities/cbt.macro.entity";
import { QueryDto } from "../dtos/query.dto";
import { DeleteDto } from "../dtos/delete.dto";

@ApiTags("CBT Macro - Climate Finance Macro Indicators")
@ApiBearerAuth()
@Controller("cbt-macro")
export class CBTMacroController {
  constructor(private readonly cbtMacroService: CBTMacroService) {}

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTMacroEntity))
  @Post("add")
  addCBTMacro(@Body() cbtMacroDto: CBTMacroDto, @Request() req) {
    return this.cbtMacroService.createCBTMacro(cbtMacroDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTMacroEntity, true))
  @Post("query")
  queryCBTMacro(@Body() query: QueryDto, @Request() req) {
    return this.cbtMacroService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTMacroEntity, true))
  @Get("/:id")
  getCBTMacroById(@Param("id") id: string, @Request() req) {
    return this.cbtMacroService.getCBTMacroById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTMacroEntity))
  @Put("update")
  updateCBTMacro(@Body() cbtMacroUpdateDto: CBTMacroUpdateDto, @Request() req) {
    return this.cbtMacroService.updateCBTMacro(cbtMacroUpdateDto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTMacroEntity))
  @Delete("delete")
  deleteCBTMacro(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.cbtMacroService.deleteCBTMacro(deleteDto, req.user);
  }
}
