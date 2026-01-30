import {
    Controller,
    UseGuards,
    Request,
    Post,
    Body,
    Get,
    Param,
    Query,
    Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags, ApiProduces } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PoliciesGuardEx } from "src/casl/policy.guard";
import { Action } from "src/casl/action.enum";
import { GhgProjectionService } from "src/projection/projection.service";
import { ProjectionExportService } from "src/projection/projection-export.service";
import { ProjectionEntity } from "src/entities/projection.entity";
import { ProjectionDto, ProjectionValidateDto } from "src/dtos/projection.dto";
import { ExtendedProjectionType, ProjectionType } from "src/enums/projection.enum";
import { ProjectionExportQueryDto } from "src/dtos/projection.export.query.dto";

@ApiTags("Projections")
@ApiBearerAuth()
@Controller("projections")
export class GHGProjectionController {
    constructor(
        private projectionService: GhgProjectionService,
        private projectionExportService: ProjectionExportService,
    ) {}
  
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Create, ProjectionEntity))
    @Post("add")
    addEmission(@Body() projectionDto: ProjectionDto, @Request() req) {
      console.log("came here")
        return this.projectionService.create(projectionDto, req.user);
    }

    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Validate, ProjectionEntity))
    @Post("validate")
    validateEmission(@Body() projectionValidateDto: ProjectionValidateDto, @Request() req) {
        return this.projectionService.validate(projectionValidateDto, req.user);
    }

    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProjectionEntity, true))
    @Get('/actual/:projectionType')
    getActualProjections(@Param('projectionType') projectionType: ProjectionType, @Request() req) {
      return this.projectionService.getActualProjection(projectionType, req.user);
    }

    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProjectionEntity, true))
    @Get('/calculated/:projectionType')
    getCalculatedProjections(@Param('projectionType') projectionType: ExtendedProjectionType, @Request() req) {
      return this.projectionService.getCalculatedProjection(projectionType, req.user);
    }

    /**
     * Export GHG projections to Excel file.
     * 
     * Returns an XLSX file with:
     * - Summary sheet: aggregated sector totals (5-year intervals)
     * - Individual sector sheets: detailed leaf category data (yearly)
     */
    @UseGuards(JwtAuthGuard, PoliciesGuardEx(true, Action.Read, ProjectionEntity, true))
    @Get('/export')
    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    async exportProjections(
        @Query() query: ProjectionExportQueryDto,
        @Res() res: Response,
    ) {
        const { buffer, filename, contentType } = await this.projectionExportService.exportProjectionWithMetadata(
            query.scenarioType,
        );

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length,
        });

        res.send(buffer);
    }
}