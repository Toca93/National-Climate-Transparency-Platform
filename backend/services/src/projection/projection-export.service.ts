import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { ProjectionEntity } from '../entities/projection.entity';
import { ExtendedProjectionType, ProjectionLeafSection } from '../enums/projection.enum';
import { ProjectionData } from '../dtos/projection.dto';
import {
  buildSummaryRows,
  DETAIL_YEARS,
  LEAF_CATEGORY_NAMES,
  ProjectionExportDataset,
  ProjectionScenarioType,
  ProjectionSectorRow,
  ProjectionSectorSheet,
  ProjectionSummarySector,
  SECTOR_LEAF_CATEGORIES,
  SUMMARY_YEARS,
} from '../dtos/data.export.projection.dto';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Expected length of projection data arrays (2000–2050 inclusive) */
const EXPECTED_SERIES_LENGTH = 51;

/** Fixed order of sectors for export sheets */
const SECTOR_ORDER: ProjectionSummarySector[] = [
  ProjectionSummarySector.ENERGY,
  ProjectionSummarySector.IPPU,
  ProjectionSummarySector.AFOLU,
  ProjectionSummarySector.WASTE,
  ProjectionSummarySector.OTHER,
];

/** Scenario labels for display */
const SCENARIO_LABELS: Record<ProjectionScenarioType, string> = {
  WM: 'With Measures',
  WAM: 'With Additional Measures',
  WOM: 'Without Measures',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Maps export scenario type to ExtendedProjectionType enum value.
 *
 * User-entered projection data is stored with non-BASELINE types.
 */
function getProjectionTypeForScenario(scenarioType: ProjectionScenarioType): ExtendedProjectionType {
  switch (scenarioType) {
    case 'WM':
      return ExtendedProjectionType.WITH_MEASURES;
    case 'WAM':
      return ExtendedProjectionType.WITH_ADDITIONAL_MEASURES;
    case 'WOM':
      return ExtendedProjectionType.WITHOUT_MEASURES;
    default:
      // Fail fast for unsupported scenario types
      throw new Error(`Unsupported scenario type: ${scenarioType}`);
  }
}

/**
 * Normalizes a projection data series to the expected length.
 *
 * - If input is not an array or is undefined/null, returns array of zeros
 * - Replaces non-finite values (null, undefined, NaN, Infinity) with 0
 * - Pads with zeros if shorter than expected
 * - Truncates if longer than expected
 *
 * @param series - Raw series data from projectionData
 * @param expectedLen - Expected array length (default: 51)
 * @returns Normalized number array of exact length
 */
function normalizeSeries(series: unknown, expectedLen: number = EXPECTED_SERIES_LENGTH): number[] {
  // Handle non-array input
  if (!Array.isArray(series)) {
    return new Array(expectedLen).fill(0);
  }

  // Normalize values and ensure correct length
  const normalized: number[] = [];
  for (let i = 0; i < expectedLen; i++) {
    if (i < series.length) {
      const val = series[i];
      // Treat non-finite values as 0
      normalized.push(typeof val === 'number' && Number.isFinite(val) ? val : 0);
    } else {
      // Pad with zeros
      normalized.push(0);
    }
  }

  return normalized;
}

/**
 * Builds sector sheets from projection data.
 *
 * @param projectionData - Raw projection data from database (JSONB)
 * @returns Array of ProjectionSectorSheet in fixed sector order
 */
function buildSectorSheets(projectionData: ProjectionData | undefined): ProjectionSectorSheet[] {
  const data = projectionData ?? ({} as Record<string, number[]>);

  return SECTOR_ORDER.map((sectorName): ProjectionSectorSheet => {
    const leafCategories = SECTOR_LEAF_CATEGORIES[sectorName];

    const rows: ProjectionSectorRow[] = leafCategories.map((leafKey): ProjectionSectorRow => {
      // Get raw series for this leaf category
      const rawSeries = (data as Record<string, number[]>)[leafKey];
      const values = normalizeSeries(rawSeries, DETAIL_YEARS.length);

      return {
        leafKey,
        // Format: "3A1. Enteric Fermentation"
        categoryName: `${leafKey}. ${LEAF_CATEGORY_NAMES[leafKey] || ''}`.trim(),
        values,
      };
    });

    return { sectorName, rows };
  });
}

// ============================================================================
// SERVICE
// ============================================================================

@Injectable()
export class ProjectionExportService {
  private readonly logger = new Logger(ProjectionExportService.name);

  constructor(
    @InjectRepository(ProjectionEntity)
    private readonly projectionRepo: Repository<ProjectionEntity>,
  ) {}

  /**
   * Fetches and builds the complete projection export dataset for a given scenario.
   *
   * This method:
   * 1. Maps scenario type to the correct ExtendedProjectionType
   * 2. Fetches the projection entity from database
   * 3. Builds sector sheets from projection data
   * 4. Aggregates summary rows from sector sheets
   * 5. Returns the complete dataset ready for Excel generation
   *
   * @param scenarioType - Export scenario type ('WM' for With Measures)
   * @returns Complete dataset for Excel export
   * @throws HttpException if projection not found
   */
  async getProjectionExportDataset(
    scenarioType: ProjectionScenarioType,
  ): Promise<ProjectionExportDataset> {
    // 1. Map scenario type to database enum
    const projectionType = getProjectionTypeForScenario(scenarioType);

    // 2. Fetch projection entity
    // TODO: Add state validation if export should only work for FINALIZED projections
    //       Currently allowing export regardless of state to keep logic minimal
    const projection = await this.projectionRepo.findOne({
      where: { projectionType },
    });

    if (!projection) {
      this.logger.warn(`Projection not found for type: ${projectionType}`);
      throw new HttpException(
        `Projection data not found for scenario: ${scenarioType} (type: ${projectionType})`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 3. Build sector sheets from projection data
    const sectorSheets = buildSectorSheets(projection.projectionData);

    // 4. Build summary rows by aggregating sector data
    const summaryRows = buildSummaryRows(sectorSheets, SUMMARY_YEARS);

    // 5. Return complete dataset
    return {
      scenarioType,
      scenarioLabel: SCENARIO_LABELS[scenarioType],
      summaryYears: SUMMARY_YEARS,
      detailYears: DETAIL_YEARS,
      summaryRows,
      sectorSheets,
      generatedAt: new Date(),
    };
  }

  /**
   * Generates an Excel workbook buffer from the projection export dataset.
   *
   * Creates a multi-sheet workbook:
   * - "Summary" sheet: aggregated sector totals for SUMMARY_YEARS
   * - One sheet per sector: detailed leaf category data for all DETAIL_YEARS
   *
   * @param dataset - Complete projection export dataset
   * @returns Excel file as Buffer
   */
  async exportProjectionToXlsxBuffer(dataset: ProjectionExportDataset): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'GHG Projections Export';
    workbook.created = dataset.generatedAt;

    // 1. Create Summary sheet
    this.createSummarySheet(workbook, dataset);

    // 2. Create sector sheets
    for (const sectorSheet of dataset.sectorSheets) {
      this.createSectorSheet(workbook, sectorSheet, dataset.detailYears);
    }

    // 3. Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Creates the Summary sheet with aggregated sector data.
   */
  private createSummarySheet(workbook: ExcelJS.Workbook, dataset: ProjectionExportDataset): void {
    const sheet = workbook.addWorksheet('Summary');

    // Header row: "Sector" + years
    const headerRow = ['Sector', ...dataset.summaryYears.map(String)];
    sheet.addRow(headerRow);

    // Data rows: one per sector
    for (const summaryRow of dataset.summaryRows) {
      const rowData: (string | number)[] = [summaryRow.sector];
      for (const year of dataset.summaryYears) {
        rowData.push(summaryRow.values[year] ?? 0);
      }
      sheet.addRow(rowData);
    }

    // Apply basic formatting
    this.applySheetFormatting(sheet, dataset.summaryYears.length + 1);
  }

  /**
   * Creates a sector sheet with detailed leaf category data.
   */
  private createSectorSheet(
    workbook: ExcelJS.Workbook,
    sectorSheet: ProjectionSectorSheet,
    detailYears: number[],
  ): void {
    const sheet = workbook.addWorksheet(sectorSheet.sectorName);

    // Header row: "Category" + years
    const headerRow = ['Category', ...detailYears.map(String)];
    sheet.addRow(headerRow);

    // Data rows: one per leaf category
    for (const row of sectorSheet.rows) {
      const rowData: (string | number)[] = [row.categoryName];
      for (let i = 0; i < detailYears.length; i++) {
        rowData.push(row.values[i] ?? 0);
      }
      sheet.addRow(rowData);
    }

    // Apply basic formatting
    this.applySheetFormatting(sheet, detailYears.length + 1);
  }

  /**
   * Applies basic formatting to a worksheet:
   * - Freeze top row and first column
   * - Auto-fit column widths
   * - Apply number format to data cells
   */
  private applySheetFormatting(sheet: ExcelJS.Worksheet, columnCount: number): void {
    // Freeze top row and first column
    sheet.views = [
      { state: 'frozen', xSplit: 1, ySplit: 1, topLeftCell: 'B2', activeCell: 'B2' },
    ];

    // Auto-fit first column (category/sector names)
    let maxWidth = 10;
    sheet.getColumn(1).eachCell((cell) => {
      const cellValue = cell.value?.toString() || '';
      maxWidth = Math.max(maxWidth, cellValue.length + 2);
    });
    sheet.getColumn(1).width = Math.min(maxWidth, 60); // Cap at 60

    // Set year columns width and number format
    for (let i = 2; i <= columnCount; i++) {
      const col = sheet.getColumn(i);
      col.width = 12;
      col.numFmt = '#,##0.00';
    }

    // Bold header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
  }

  /**
   * High-level method: fetches dataset and exports to Excel buffer.
   *
   * @param scenarioType - Scenario type ('WM')
   * @returns Excel file buffer ready for HTTP response
   */
  async exportProjection(scenarioType: ProjectionScenarioType): Promise<Buffer> {
    const dataset = await this.getProjectionExportDataset(scenarioType);
    return this.exportProjectionToXlsxBuffer(dataset);
  }
}

