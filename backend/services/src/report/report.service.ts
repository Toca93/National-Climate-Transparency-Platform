import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataExportQueryDto } from "../dtos/data.export.query.dto";
import { DataExportReportFiveDto } from "../dtos/data.export.reportFive.dto";
import { DataExportReportThirteenDto } from "../dtos/data.export.reportThirteen.dto";
import { DataExportReportTwelveDto } from "../dtos/data.export.reportTwelve.dto";
import { DataListResponseDto } from "../dtos/data.list.response";
import { QueryDto } from "../dtos/query.dto";
import { ReportFiveViewEntity } from "../entities/report.five.view.entity";
import { Annexes, Reports } from "../enums/shared.enum";
import { DataExportService } from "../util/dataExport.service";
import { HelperService } from "../util/helpers.service";
import { Repository } from "typeorm";
import { DataExportReportSixDto } from "../dtos/data.export.reportSix.dto";
import { DataExportReportSevenDto } from "../dtos/data.export.reportSeven.dto";
import { DataExportReportEightDto } from "../dtos/data.export.reportEight.dto";
import { DataExportReportNineDto } from "../dtos/data.export.reportNine.dto";
import { DataExportReportTenDto } from "../dtos/data.export.reportTen.dto";
import { DataExportReportElevenDto } from "../dtos/data.export.reportEleven.dto";
import { AnnexThreeViewEntity } from "../entities/annexThree.view.entity";
import { ImpleMeans } from "../enums/activity.enum";
import { SupportDirection } from "../enums/support.enum";
import { ActionType } from "../enums/action.enum";
import { AnnexTwoViewEntity } from "../entities/annexTwo.view.entity";
import { DataExportAnnexTwoReportSevenDto } from "src/dtos/data.export.annexTwo.reportSeven.dto";

export class ReportService {
  constructor(
    @InjectRepository(ReportFiveViewEntity)
    private reportFiveViewRepo: Repository<ReportFiveViewEntity>,
    @InjectRepository(AnnexTwoViewEntity)
    private annexTwoViewRepo: Repository<AnnexTwoViewEntity>,
    @InjectRepository(AnnexThreeViewEntity)
    private annexThreeViewRepo: Repository<AnnexThreeViewEntity>,
    private helperService: HelperService,
    private dataExportService: DataExportService
  ) {}

  async getTableData(annex: Annexes, id: Reports, query: QueryDto) {
    const queryBuilder = this.getReportQueryBuilder(annex, id);

    if (query.size && query.page) {
      queryBuilder
        .offset(query.size * query.page - query.size)
        .limit(query.size);
    }

    const resp = await queryBuilder.getManyAndCount();

    return new DataListResponseDto(
      resp.length > 0 ? resp[0] : undefined,
      resp.length > 1 ? resp[1] : undefined
    );

    // const totalCount: number = await queryBuilder.getCount();
    // const data: any[] = await queryBuilder.getMany();

    // return new DataListResponseDto(
    //   data,
    //   totalCount
    // );
  }

  getReportQueryBuilder(annexNumber: Annexes, reportNumber: Reports) {
    if (annexNumber === Annexes.TWO) {
      if (reportNumber === Reports.FIVE) {
        return this.reportFiveViewRepo.createQueryBuilder("reportFive");
      } else {
        // get new annex II reports
        let column = "";
        switch (reportNumber) {
          case Reports.SEVEN:
            column = "withM";
            break;
          case Reports.EIGHT:
            column = "withAM";
            break;
          case Reports.NINE:
            column = "withoutM";
            break;
        }

        const qb = this.annexTwoViewRepo.createQueryBuilder();
        // .select(["category", `("${column}") AS "data"`]);
        console.log(qb.getQuery());
        return qb;
      }
    } else {
      let direction: SupportDirection;
      let mitigationType: ActionType[];
      let meansOfImplementation: ImpleMeans[];
      // ML - removed ActionType.TRANSPARENCY in SIX and SEVEN and Add it to TWELVE and THIRTEEN
      switch (reportNumber) {
        case Reports.SIX:
          direction = SupportDirection.NEEDED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [
            ImpleMeans.FINANCE,
            ImpleMeans.TECH_DEV,
            ImpleMeans.CAPACITY_BUILD,
          ];
          break;
        case Reports.SEVEN:
          direction = SupportDirection.RECEIVED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [
            ImpleMeans.FINANCE,
            ImpleMeans.TECH_DEV,
            ImpleMeans.CAPACITY_BUILD,
          ];
          break;
        case Reports.EIGHT:
          direction = SupportDirection.NEEDED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [ImpleMeans.TECH_DEV];
          break;
        case Reports.NINE:
          direction = SupportDirection.RECEIVED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [ImpleMeans.TECH_DEV];
          break;
        case Reports.TEN:
          direction = SupportDirection.NEEDED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [ImpleMeans.CAPACITY_BUILD];
          break;
        case Reports.ELEVEN:
          direction = SupportDirection.RECEIVED;
          mitigationType = [
            ActionType.MITIGATION,
            ActionType.ADAPTION,
            ActionType.CROSSCUT,
            ActionType.OTHER,
          ];
          meansOfImplementation = [ImpleMeans.CAPACITY_BUILD];
          break;
        case Reports.TWELVE:
          direction = SupportDirection.NEEDED;
          mitigationType = [ActionType.TRANSPARENCY];
          meansOfImplementation = [
            ImpleMeans.TRANSP,
            ImpleMeans.CAPACITY_BUILD,
          ];
          break;
        case Reports.THIRTEEN:
          direction = SupportDirection.RECEIVED;
          mitigationType = [ActionType.TRANSPARENCY];
          meansOfImplementation = [
            ImpleMeans.TRANSP,
            ImpleMeans.CAPACITY_BUILD,
          ];
          break;
      }

      let mitigationCondition = "";
      let implimentationCondition = "";

      mitigationType.forEach((mitigation, index) => {
        mitigationCondition =
          index > 0
            ? `${mitigationCondition} OR annex_three.type = '${mitigation}'`
            : `annex_three.type = '${mitigation}'`;
      });
      meansOfImplementation.forEach((implementation, index) => {
        implimentationCondition =
          index > 0
            ? `${implimentationCondition} OR annex_three.meansOfImplementation = '${implementation}'`
            : `annex_three.meansOfImplementation = '${implementation}'`;
      });

      mitigationCondition = `(${mitigationCondition})`;
      implimentationCondition = `(${implimentationCondition})`;

      const qb = this.annexThreeViewRepo
        .createQueryBuilder("annex_three")
        .where("annex_three.direction = :direction", { direction: direction })
        .andWhere(implimentationCondition)
        .andWhere(mitigationCondition);
      return qb;
    }
  }

  async downloadReportData(
    annexNumber: Annexes,
    tableNumber: Reports,
    dataExportQueryDto: DataExportQueryDto
  ) {
    const resp = await this.getReportQueryBuilder(
      annexNumber,
      tableNumber
    ).getMany();

    if (resp.length > 0) {
      let prepData;
      let localFileName;
      let localTableNameKey;

      if (annexNumber === Annexes.TWO) {
        // For Annex II reports, we need to handle them differently
        switch (tableNumber) {
          case Reports.FIVE:
            prepData = this.prepareReportFiveDataForExport(
              resp as ReportFiveViewEntity[]
            );
            localFileName = "reportExport.";
            localTableNameKey = "reportExport.tableFive";
            break;

          case Reports.SEVEN:
            prepData = this.prepareAnnexTwoReportSevenDataForExport(
              resp as AnnexTwoViewEntity[]
            );
            localFileName = "annexTwoExport.";
            localTableNameKey = "annexTwoExport.reportSevenName";
            break;
          case Reports.EIGHT:
            prepData = this.prepareAnnexTwoReportEightDataForExport(
              resp as AnnexTwoViewEntity[]
            );
            localFileName = "annexTwoExport.";
            localTableNameKey = "annexTwoExport.reportEightName";
            break;
          case Reports.NINE:
            prepData = this.prepareAnnexTwoReportNineDataForExport(
              resp as AnnexTwoViewEntity[]
            );
            localFileName = "annexTwoExport.";
            localTableNameKey = "annexTwoExport.reportNineName";
            break;

          default:
            throw new HttpException(
              this.helperService.formatReqMessagesString(
                "reportExport.unsupportedReport",
                []
              ),
              HttpStatus.BAD_REQUEST
            );
        }
      } else {
        switch (tableNumber) {
          case Reports.FIVE:
            prepData = this.prepareReportFiveDataForExport(
              resp as ReportFiveViewEntity[]
            );
            localFileName = "reportExport.";
            localTableNameKey = "reportExport.tableFive";
            break;

          case Reports.SIX:
            prepData = this.prepareReportSixDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportSixExport.";
            localTableNameKey = "reportSixExport.tableSix";
            break;

          case Reports.SEVEN:
            prepData = this.prepareReportSevenDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportSevenExport.";
            localTableNameKey = "reportSevenExport.tableSeven";
            break;

          case Reports.EIGHT:
            prepData = this.prepareReportEightDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportEightExport.";
            localTableNameKey = "reportEightExport.tableEight";
            break;

          case Reports.NINE:
            prepData = this.prepareReportNineDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportNineExport.";
            localTableNameKey = "reportNineExport.tableNine";
            break;

          case Reports.TEN:
            prepData = this.prepareReportTenDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportTenExport.";
            localTableNameKey = "reportTenExport.tableTen";
            break;

          case Reports.ELEVEN:
            prepData = this.prepareReportElevenDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportElevenExport.";
            localTableNameKey = "reportElevenExport.tableEleven";
            break;

          case Reports.TWELVE:
            prepData = this.prepareReportTwelveDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportTwelveExport.";
            localTableNameKey = "reportTwelveExport.tableTwelve";
            break;

          case Reports.THIRTEEN:
            prepData = this.prepareReportThirteenDataForExport(
              resp as AnnexThreeViewEntity[]
            );
            localFileName = "reportTwelveExport.";
            localTableNameKey = "reportTwelveExport.tableThirteen";
            break;

          default:
            break;
        }
      }

      let headers: string[] = [];
      const titleKeys = Object.keys(prepData[0]);
      for (const key of titleKeys) {
        headers.push(
          this.helperService.formatReqMessagesString(localFileName + key, [])
        );
      }

      const path = await this.dataExportService.generateCsvOrExcel(
        prepData,
        headers,
        this.helperService.formatReqMessagesString(localTableNameKey, []),
        dataExportQueryDto.fileType
      );

      return path;
    }
    throw new HttpException(
      this.helperService.formatReqMessagesString(
        "reportExport.nothingToExport",
        []
      ),
      HttpStatus.BAD_REQUEST
    );
  }

  private prepareReportFiveDataForExport(data: ReportFiveViewEntity[]) {
    const exportData: DataExportReportFiveDto[] = [];

    for (const report of data) {
      const dto: DataExportReportFiveDto = new DataExportReportFiveDto();
      dto.titleOfAction = report.titleOfAction;
      dto.description = report.description;
      dto.objective = report.objective;
      dto.instrumentType = report.instrumentType;
      dto.status = report.status;
      dto.sector = report.sector;
      dto.ghgsAffected = report.ghgsAffected;
      dto.startYear = report.startYear;
      dto.implementingEntities = report.implementingEntities;
      dto.achievedGHGReduction = report.achievedGHGReduction;
      dto.expectedGHGReduction = report.expectedGHGReduction;

      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportSixDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportSixDto[] = [];

    for (const report of data) {
      const dto: DataExportReportSixDto = {
        activityId: report.activityId,
        sector: report.sector,
        subSectors: report.subSector,
        titleOfActivity: report.title,
        description: report.description,
        requiredAmountDomestic: report.requiredAmountDomestic,
        requiredAmount: report.requiredAmount,
        startYear: report.startYear,
        endYear: report.endYear,
        financialInstrument: report.internationalFinancialInstrument,
        type: report.type,
        techDevelopment:
          report.meansOfImplementation === ImpleMeans.TECH_DEV ? "Yes" : "No",
        capacityBuilding:
          report.meansOfImplementation === ImpleMeans.CAPACITY_BUILD
            ? "Yes"
            : "No",
        anchoredInNationalStrategy: report.anchoredInNationalStrategy
          ? "Yes"
          : "No",
        supportChannel: report.internationalSupportChannel,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportSevenDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportSevenDto[] = [];

    for (const report of data) {
      const dto: DataExportReportSevenDto = {
        activityId: report.activityId,
        titleOfActivity: report.title,
        description: report.description,
        supportChannel: report.internationalSupportChannel,
        recipientEntities: report.recipientEntities,
        nationalImplementingEntities: report.nationalImplementingEntity,
        internationalImplementingEntities:
          report.internationalImplementingEntity,
        receivedAmountDomestic: report.receivedAmountDomestic,
        receivedAmount: report.receivedAmount,
        startYear: report.startYear,
        endYear: report.endYear,
        financialInstrument: report.internationalFinancialInstrument,
        financingStatus: report.financingStatus,
        type: report.type,
        sector: report.sector,
        subSectors: report.subSector,
        techDevelopment:
          report.meansOfImplementation === ImpleMeans.TECH_DEV ? "Yes" : "No",
        capacityBuilding:
          report.meansOfImplementation === ImpleMeans.CAPACITY_BUILD
            ? "Yes"
            : "No",
        activityStatus: report.status,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportEightDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportEightDto[] = [];

    for (const report of data) {
      const dto: DataExportReportEightDto = {
        activityId: report.activityId,
        sector: report.sector,
        subSectors: report.subSector,
        titleOfActivity: report.title,
        description: report.description,
        type: report.type,
        technologyType: report.technologyType,
        startYear: report.startYear,
        endYear: report.endYear,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };

      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportNineDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportNineDto[] = [];

    for (const report of data) {
      const dto: DataExportReportNineDto = {
        activityId: report.activityId,
        titleOfActivity: report.title,
        description: report.description,
        technologyType: report.technologyType,
        startYear: report.startYear,
        endYear: report.endYear,
        recipientEntities: report.recipientEntities,
        nationalImplementingEntities: report.nationalImplementingEntity,
        internationalImplementingEntities:
          report.internationalImplementingEntity,
        type: report.type,
        sector: report.sector,
        subSectors: report.subSector,
        activityStatus: report.status,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };

      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportTenDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportTenDto[] = [];

    for (const report of data) {
      const dto: DataExportReportTenDto = {
        activityId: report.activityId,
        sector: report.sector,
        subSectors: report.subSector,
        titleOfActivity: report.title,
        description: report.description,
        type: report.type,
        startYear: report.startYear,
        endYear: report.endYear,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };

      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportElevenDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportElevenDto[] = [];

    for (const report of data) {
      const dto: DataExportReportElevenDto = {
        activityId: report.activityId,
        titleOfActivity: report.title,
        description: report.description,
        startYear: report.startYear,
        endYear: report.endYear,
        recipientEntities: report.recipientEntities,
        nationalImplementingEntities: report.nationalImplementingEntity,
        internationalImplementingEntities:
          report.internationalImplementingEntity,
        type: report.type,
        sector: report.sector,
        subSectors: report.subSector,
        activityStatus: report.status,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportTwelveDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportTwelveDto[] = [];

    for (const report of data) {
      const dto: DataExportReportTwelveDto = {
        activityId: report.activityId,
        titleOfActivity: report.title,
        description: report.description,
        startYear: report.startYear,
        endYear: report.endYear,
        recipientEntities: report.recipientEntities,
        supportChannel: report.internationalSupportChannel,
        requiredAmountDomestic: report.requiredAmountDomestic,
        requiredAmount: report.requiredAmount,
        activityStatus: report.status,
        achievedGHGReduction:
          report.achievedGHGReductionAlternate ||
          report.achievedGHGReduction ||
          "N/A",
        additionalInfo: report.etfDescription,
      };

      exportData.push(dto);
    }

    return exportData;
  }

  private prepareReportThirteenDataForExport(data: AnnexThreeViewEntity[]) {
    const exportData: DataExportReportThirteenDto[] = [];

    for (const report of data) {
      const dto: DataExportReportThirteenDto = {
        activityId: report.activityId,
        titleOfActivity: report.title,
        description: report.description,
        startYear: report.startYear,
        endYear: report.endYear,
        recipientEntities: report.recipientEntities,
        supportChannel: report.internationalSupportChannel,
        receivedAmountDomestic: report.receivedAmountDomestic,
        receivedAmount: report.receivedAmount,
        activityStatus: report.status,
        additionalInfo: report.etfDescription,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareAnnexTwoReportSevenDataForExport(data: AnnexTwoViewEntity[]) {
    const exportData: DataExportAnnexTwoReportSevenDto[] = [];
    const thisYear = new Date().getFullYear();

    for (const report of data) {
      const dto: DataExportAnnexTwoReportSevenDto = {
        category: report.category,
        thisYear: report.withM[thisYear - 2000],
        projection1: report.withM[thisYear + 5 - (thisYear % 5) - 2000] || 0,
        projection2: report.withM[thisYear + 10 - (thisYear % 5) - 2000] || 0,
        projection3: report.withM[thisYear + 15 - (thisYear % 5) - 2000] || 0,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareAnnexTwoReportEightDataForExport(data: AnnexTwoViewEntity[]) {
    const exportData: DataExportAnnexTwoReportSevenDto[] = [];
    const thisYear = new Date().getFullYear();

    for (const report of data) {
      const dto: DataExportAnnexTwoReportSevenDto = {
        category: report.category,
        thisYear: report.withAM[thisYear - 2000],
        projection1: report.withAM[thisYear + 5 - (thisYear % 5) - 2000] || 0,
        projection2: report.withAM[thisYear + 10 - (thisYear % 5) - 2000] || 0,
        projection3: report.withAM[thisYear + 15 - (thisYear % 5) - 2000] || 0,
      };
      exportData.push(dto);
    }

    return exportData;
  }

  private prepareAnnexTwoReportNineDataForExport(data: AnnexTwoViewEntity[]) {
    const exportData: DataExportAnnexTwoReportSevenDto[] = [];
    const thisYear = new Date().getFullYear();

    for (const report of data) {
      const dto: DataExportAnnexTwoReportSevenDto = {
        category: report.category,
        thisYear: report.withoutM[thisYear - 2000],
        projection1: report.withoutM[thisYear + 5 - (thisYear % 5) - 2000] || 0,
        projection2:
          report.withoutM[thisYear + 10 - (thisYear % 5) - 2000] || 0,
        projection3:
          report.withoutM[thisYear + 15 - (thisYear % 5) - 2000] || 0,
      };
      exportData.push(dto);
    }

    return exportData;
  }
}
