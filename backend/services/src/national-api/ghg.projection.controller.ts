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
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiTags, ApiQuery, ApiProduces } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PoliciesGuardEx } from "src/casl/policy.guard";
import { Action } from "src/casl/action.enum";
import { GhgProjectionService } from "src/projection/projection.service";
import { ProjectionExportService } from "src/projection/projection-export.service";
import { ProjectionEntity } from "src/entities/projection.entity";
import { ProjectionDto, ProjectionValidateDto } from "src/dtos/projection.dto";
import { ExtendedProjectionType, ProjectionType } from "src/enums/projection.enum";
import { ProjectionScenarioType } from "src/dtos/data.export.projection.dto";

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
    @ApiQuery({ 
        name: 'scenarioType', 
        enum: ['WM', 'WAM', 'WOM'], 
        required: true, 
        description: 'Scenario type: WM (With Measures), WAM (With Additional Measures), WOM (Without Measures)' 
    })

    @ApiProduces('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    async exportProjections(
        @Query('scenarioType') scenarioType: string,
        @Res() res: Response,
    ) {
        // Validate scenario type
        const validScenarios = ['WM', 'WAM', 'WOM'];
        if (!validScenarios.includes(scenarioType)) {
            throw new HttpException(
                `Invalid scenario type: ${scenarioType}. Supported: ${validScenarios.join(', ')}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        const buffer = await this.projectionExportService.exportProjection(
            scenarioType as ProjectionScenarioType,
        );

        const filename = `ghg-projections-${scenarioType}.xlsx`;

        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length,
        });

        res.send(buffer);
    }
}