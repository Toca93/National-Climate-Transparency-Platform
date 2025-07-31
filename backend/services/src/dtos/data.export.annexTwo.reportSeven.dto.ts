import { ReportCategoryType } from "src/enums/report.category.type.enum";
import { DataExportDto } from "./data.export.dto";


export class DataExportAnnexTwoReportSevenDto extends DataExportDto {
    category: ReportCategoryType;
    thisYear: number;
    data: Array<number>;
  }