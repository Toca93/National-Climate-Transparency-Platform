import {
    Controller,
    UseGuards,
    Request,
    Get,
    Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PoliciesGuardEx } from "src/casl/policy.guard";
import { Action } from "src/casl/action.enum";
import { ProjectionEntity } from "src/entities/projection.entity";
import { ProjectionType } from "src/enums/projection.enum";
import { GhgCombinedReductionService } from "src/combined.reduction/combined.reduction.service";
import { ReductionType } from "src/enums/reduction.enum";

@ApiTags("CombinedReductions")
@ApiBearerAuth()
@Controller("combinedReductions")
export class GHGCombinedReductionController {
    constructor(private ghgCombinedReductionService: GhgCombinedReductionService) {}

    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProjectionEntity, true))
    @Get('/actual/:reductionType')
    getActualReductions(@Param('reductionType') reductionType: ReductionType, @Request() req) {
      return this.ghgCombinedReductionService.getActualReductions(reductionType, req.user);
    }

    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProjectionEntity, true))
    @Get('/expected/:projectionType')
    getExpectedReductions(@Param('projectionType') projectionType: ProjectionType, @Request() req) {
      return this.ghgCombinedReductionService.getExpectedReductions(projectionType, req.user);
    }
    
}