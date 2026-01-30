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
import { CBTFinanceNeededDto, CBTFinanceNeededUpdateDto } from "../dtos/cbtFinanceNeeded.dto";
import { CBTFinanceReceivedDto, CBTFinanceReceivedUpdateDto } from "../dtos/cbtFinanceReceived.dto";
import {
  CBTTransparencyNeededDto,
  CBTTransparencyNeededUpdateDto,
  CBTTransparencyReceivedDto,
  CBTTransparencyReceivedUpdateDto,
} from "../dtos/cbtTransparency.dto";
import { CBTService } from "../cbt/cbt.service";
import { CBTFinanceNeededService } from "../cbt/cbtFinanceNeeded.service";
import { CBTFinanceReceivedService } from "../cbt/cbtFinanceReceived.service";
import { CBTTransparencyNeededService } from "../cbt/cbtTransparencyNeeded.service";
import { CBTTransparencyReceivedService } from "../cbt/cbtTransparencyReceived.service";
import { CBTEntity } from "../entities/cbt.entity";
import { CBTFinanceNeededEntity } from "../entities/cbtFinanceNeeded.entity";
import { CBTFinanceReceivedEntity } from "../entities/cbtFinanceReceived.entity";
import { CBTTransparencyNeededEntity } from "../entities/cbtTransparencyNeeded.entity";
import { CBTTransparencyReceivedEntity } from "../entities/cbtTransparencyReceived.entity";
import { QueryDto } from "../dtos/query.dto";
import { DeleteDto } from "../dtos/delete.dto";

@ApiTags("CBT - Climate Finance")
@ApiBearerAuth()
@Controller("cbt")
export class CBTController {
  constructor(
    private readonly cbtService: CBTService,
    private readonly financeNeededService: CBTFinanceNeededService,
    private readonly financeReceivedService: CBTFinanceReceivedService,
    private readonly transparencyNeededService: CBTTransparencyNeededService,
    private readonly transparencyReceivedService: CBTTransparencyReceivedService,
  ) {}

  // CBT Basic endpoints
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
  getCBTById(@Param("id") id: string) {
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

  // Finance Needed (Table III.6)
  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTFinanceNeededEntity))
  @Post("finance-needed/add")
  addFinanceNeeded(@Body() dto: CBTFinanceNeededDto, @Request() req) {
    return this.financeNeededService.create(dto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFinanceNeededEntity, true))
  @Post("finance-needed/query")
  queryFinanceNeeded(@Body() query: QueryDto, @Request() req) {
    return this.financeNeededService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFinanceNeededEntity, true))
  @Get("finance-needed/:id")
  getFinanceNeededById(@Param("id") id: string) {
    return this.financeNeededService.getById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTFinanceNeededEntity))
  @Put("finance-needed/update")
  updateFinanceNeeded(@Body() dto: CBTFinanceNeededUpdateDto, @Request() req) {
    return this.financeNeededService.update(dto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTFinanceNeededEntity))
  @Delete("finance-needed/delete")
  deleteFinanceNeeded(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.financeNeededService.delete(deleteDto, req.user);
  }

  // Finance Received (Table III.7)
  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTFinanceReceivedEntity))
  @Post("finance-received/add")
  addFinanceReceived(@Body() dto: CBTFinanceReceivedDto, @Request() req) {
    return this.financeReceivedService.create(dto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFinanceReceivedEntity, true))
  @Post("finance-received/query")
  queryFinanceReceived(@Body() query: QueryDto, @Request() req) {
    return this.financeReceivedService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTFinanceReceivedEntity, true))
  @Get("finance-received/:id")
  getFinanceReceivedById(@Param("id") id: string) {
    return this.financeReceivedService.getById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTFinanceReceivedEntity))
  @Put("finance-received/update")
  updateFinanceReceived(@Body() dto: CBTFinanceReceivedUpdateDto, @Request() req) {
    return this.financeReceivedService.update(dto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTFinanceReceivedEntity))
  @Delete("finance-received/delete")
  deleteFinanceReceived(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.financeReceivedService.delete(deleteDto, req.user);
  }

  // Transparency Needed (Table III.12)
  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTTransparencyNeededEntity))
  @Post("transparency-needed/add")
  addTransparencyNeeded(@Body() dto: CBTTransparencyNeededDto, @Request() req) {
    return this.transparencyNeededService.create(dto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTTransparencyNeededEntity, true))
  @Post("transparency-needed/query")
  queryTransparencyNeeded(@Body() query: QueryDto, @Request() req) {
    return this.transparencyNeededService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTTransparencyNeededEntity, true))
  @Get("transparency-needed/:id")
  getTransparencyNeededById(@Param("id") id: string) {
    return this.transparencyNeededService.getById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTTransparencyNeededEntity))
  @Put("transparency-needed/update")
  updateTransparencyNeeded(@Body() dto: CBTTransparencyNeededUpdateDto, @Request() req) {
    return this.transparencyNeededService.update(dto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTTransparencyNeededEntity))
  @Delete("transparency-needed/delete")
  deleteTransparencyNeeded(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.transparencyNeededService.delete(deleteDto, req.user);
  }

  // Transparency Received (Table III.13)
  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, CBTTransparencyReceivedEntity))
  @Post("transparency-received/add")
  addTransparencyReceived(@Body() dto: CBTTransparencyReceivedDto, @Request() req) {
    return this.transparencyReceivedService.create(dto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTTransparencyReceivedEntity, true))
  @Post("transparency-received/query")
  queryTransparencyReceived(@Body() query: QueryDto, @Request() req) {
    return this.transparencyReceivedService.query(query, req.abilityCondition);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, CBTTransparencyReceivedEntity, true))
  @Get("transparency-received/:id")
  getTransparencyReceivedById(@Param("id") id: string) {
    return this.transparencyReceivedService.getById(id);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Update, CBTTransparencyReceivedEntity))
  @Put("transparency-received/update")
  updateTransparencyReceived(@Body() dto: CBTTransparencyReceivedUpdateDto, @Request() req) {
    return this.transparencyReceivedService.update(dto, req.user);
  }

  @ApiBearerAuth("api_key")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Delete, CBTTransparencyReceivedEntity))
  @Delete("transparency-received/delete")
  deleteTransparencyReceived(@Body() deleteDto: DeleteDto, @Request() req) {
    return this.transparencyReceivedService.delete(deleteDto, req.user);
  }
}
