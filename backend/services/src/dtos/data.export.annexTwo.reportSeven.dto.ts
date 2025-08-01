import { ReportCategoryType } from "src/enums/report.category.type.enum";
import { DataExportDto } from "./data.export.dto";


export class DataExportAnnexTwoReportSevenDto extends DataExportDto {
    category: ReportCategoryType;
    thisYear: number;
    projection1: number | string;
    projection2: number | string;
    projection3: number | string;
  }