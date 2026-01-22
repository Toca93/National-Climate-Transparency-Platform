import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProjectionScenarioType, VALID_SCENARIO_TYPES } from './data.export.projection.dto';

export class ProjectionExportQueryDto {
  @IsNotEmpty()
  @ApiProperty({
    enum: VALID_SCENARIO_TYPES,
    description: 'Scenario type: WM (With Measures), WAM (With Additional Measures), WOM (Without Measures)',
  })
  @IsEnum(VALID_SCENARIO_TYPES, {
    message: `Invalid scenario type. Supported: ${VALID_SCENARIO_TYPES.join(', ')}`,
  })
  scenarioType: ProjectionScenarioType;
}

