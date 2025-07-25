import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { CombinedGhgReductionViewEntity } from "src/entities/combined.ghgReduction.view.entity";
import { HelperService } from "src/util/helpers.service";
import { ProjectionType } from "src/enums/projection.enum";
import { User } from "src/entities/user.entity";
import { CombinedReductionData } from "src/dtos/combinedReductionDto";
import { ReductionType } from "src/enums/reduction.enum";

@Injectable()
export class GhgCombinedReductionService {
  constructor(
    private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CombinedGhgReductionViewEntity)
    private combinedReductionViewRepo: Repository<CombinedGhgReductionViewEntity>,
    private helperService: HelperService
  ) {}

  async getActualReductions(reductionType: ReductionType, user: User) {
    if (
      !Object.values(ReductionType).includes(reductionType as ReductionType)
    ) {
      throw new HttpException(
        this.helperService.formatReqMessagesString(
          "ghgInventory.invalidReductionType",
          []
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    let achievedReductionType;
    switch (reductionType) {
      case ReductionType.BASELINE_EMISSIONS:
        achievedReductionType = "baselineActualEmissions";
        break;
      case ReductionType.ACTIVITY_EMISSIONS:
        achievedReductionType = "activityActualEmissions";
        break;
      case ReductionType.EQUIVALENT_EMISSION_REDUCTIONS:
        achievedReductionType = "actualEmissionReduct";
        break;
    }

    const combinedReduction = await this.combinedReductionViewRepo.query(
      `SELECT 
        "ipccSubSector", 
        "${achievedReductionType}" as data,
        "startYear"
      FROM
        public.combined_ghg_reduction_view_entity
      `
    );

    const reductionData: CombinedReductionData | {} = {};
    if (combinedReduction) {
      combinedReduction.map((reductionSector) => {
        reductionSector.tag = (reductionSector.ipccSubSector as String).split(
          " ",
          1
        )[0];
        reductionData[reductionSector.tag] = reductionSector.data;
      });
    }

    return {
      reductionData,
      reductionType,
    };
  }

  async getExpectedReductions(projectionType: ProjectionType, user: User) {
    if (
      !Object.values(ProjectionType).includes(projectionType as ProjectionType)
    ) {
      throw new HttpException(
        this.helperService.formatReqMessagesString(
          "ghgInventory.invalidProjectionType",
          []
        ),
        HttpStatus.BAD_REQUEST
      );
    }

    let expectedReductionType;
    switch (projectionType) {
      case ProjectionType.WITH_MEASURES:
        expectedReductionType = "expectedEmissionReductWithM";
        break;
      case ProjectionType.WITHOUT_MEASURES:
        expectedReductionType = "baselineEmissions";
        break;
      case ProjectionType.WITH_ADDITIONAL_MEASURES:
        expectedReductionType = "expectedEmissionReductWithAM";
        break;
    }

    const combinedReduction = await this.combinedReductionViewRepo.query(
      `SELECT 
        "ipccSubSector", 
        "${expectedReductionType}" as data,
        "startYear"
      FROM
        public.combined_ghg_reduction_view_entity
      `
    );

    const reductionData: CombinedReductionData | {} = {};

    if (combinedReduction) {
      combinedReduction.map((reductionSector) => {
        reductionSector.tag = (reductionSector.ipccSubSector as String).split(
          " ",
          1
        )[0];
        reductionData[reductionSector.tag] = reductionSector.data;
      });
    }

    return {
      reductionData,
      projectionType,
    };
  }
}
