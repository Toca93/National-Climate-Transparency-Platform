import { ProjectionLeafSection } from '../enums/projection.enum';

// ============================================================================
// KONSTANTE
// ============================================================================

export const PROJECTION_START_YEAR = 2000;
export const PROJECTION_END_YEAR = 2050;
export const SUMMARY_YEAR_STEP = 5;

/** Godine za Summary sheet (korak 5) */
export const SUMMARY_YEARS: number[] = Array.from(
  { length: Math.floor((PROJECTION_END_YEAR - PROJECTION_START_YEAR) / SUMMARY_YEAR_STEP) + 1 },
  (_, i) => PROJECTION_START_YEAR + i * SUMMARY_YEAR_STEP
);

/** Godine za sektorske sheet-ove (sve godine) */
export const DETAIL_YEARS: number[] = Array.from(
  { length: PROJECTION_END_YEAR - PROJECTION_START_YEAR + 1 },
  (_, i) => PROJECTION_START_YEAR + i
);

// ============================================================================
// TIPOVI SCENARIJA
// ============================================================================

/** Svi podržani tipovi scenarija za izvoz */
export type ProjectionScenarioType = 'WM' | 'WAM' | 'WOM';

// ============================================================================
// SEKTORI
// ============================================================================

export enum ProjectionSummarySector {
  ENERGY = 'Energy',
  IPPU = 'Industrial Processes & Product Use',
  AFOLU = 'Agriculture, Forestry, and Other Land Use',
  WASTE = 'Waste',
  OTHER = 'Other',
}

/** Mapiranje leaf kategorija na sektore */
export const LEAF_TO_SECTOR_MAP: Record<ProjectionLeafSection, ProjectionSummarySector> = {
  // 1. Energy (1*)
  [ProjectionLeafSection.ENERGY_INDUSTRIES]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.MANUFACTURING_CONSTRUCTION]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.CIVIL_AVIATION]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.ROAD_TRANSPORTATION]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.RAILWAYS]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.WATER_NAVIGATION]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.OTHER_TRANSPORTATION]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.OTHER_SECTORS]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.NON_SPECIFIED]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.SOLID_FUELS]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.OIL_NATURAL_GAS]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.OTHER_EMISSIONS]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.TRANSPORT_CO2]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.INJECTION_STORAGE]: ProjectionSummarySector.ENERGY,
  [ProjectionLeafSection.OTHER_CO2]: ProjectionSummarySector.ENERGY,
  
  // 2. Industrial Processes & Product Use (2*)
  [ProjectionLeafSection.MINERAL_INDUSTRY]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.CHEMICAL_INDUSTRY]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.METAL_INDUSTRY]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.NON_ENERGY_PRODUCTS]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.ELECTRONICS_INDUSTRY]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.SUBSTITUTES_OZONE]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.OTHER_MANUFACTURE]: ProjectionSummarySector.IPPU,
  [ProjectionLeafSection.OTHER_INDUSTRIAL]: ProjectionSummarySector.IPPU,
  
  // 3. Agriculture, Forestry, and Other Land Use (3*)
  [ProjectionLeafSection.ENTERIC_FERMENTATION]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.MANURE_MANAGEMENT]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.FOREST_LAND]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.CROPLAND]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.GRASSLAND]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.WETLANDS]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.SETTLEMENTS]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.OTHER_LAND]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.AGG_SOURCE]: ProjectionSummarySector.AFOLU,
  [ProjectionLeafSection.OTHER_AGR]: ProjectionSummarySector.AFOLU,
  
  // 4. Waste (4*)
  [ProjectionLeafSection.SOLID_WASTE]: ProjectionSummarySector.WASTE,
  [ProjectionLeafSection.BIOLOGICAL_TREATMENT]: ProjectionSummarySector.WASTE,
  [ProjectionLeafSection.INCINERATION_BURNING]: ProjectionSummarySector.WASTE,
  [ProjectionLeafSection.WASTEWATER_TREATMENT]: ProjectionSummarySector.WASTE,
  [ProjectionLeafSection.OTHER_WASTE]: ProjectionSummarySector.WASTE,
  
  // 5. Other (5*)
  [ProjectionLeafSection.INDIRECT_N2O]: ProjectionSummarySector.OTHER,
  [ProjectionLeafSection.OTHER]: ProjectionSummarySector.OTHER,
};

/** Leaf kategorije po sektoru */
export const SECTOR_LEAF_CATEGORIES: Record<ProjectionSummarySector, ProjectionLeafSection[]> = {
  // 1. Energy
  [ProjectionSummarySector.ENERGY]: [
    ProjectionLeafSection.ENERGY_INDUSTRIES,
    ProjectionLeafSection.MANUFACTURING_CONSTRUCTION,
    ProjectionLeafSection.CIVIL_AVIATION,
    ProjectionLeafSection.ROAD_TRANSPORTATION,
    ProjectionLeafSection.RAILWAYS,
    ProjectionLeafSection.WATER_NAVIGATION,
    ProjectionLeafSection.OTHER_TRANSPORTATION,
    ProjectionLeafSection.OTHER_SECTORS,
    ProjectionLeafSection.NON_SPECIFIED,
    ProjectionLeafSection.SOLID_FUELS,
    ProjectionLeafSection.OIL_NATURAL_GAS,
    ProjectionLeafSection.OTHER_EMISSIONS,
    ProjectionLeafSection.TRANSPORT_CO2,
    ProjectionLeafSection.INJECTION_STORAGE,
    ProjectionLeafSection.OTHER_CO2,
  ],
  // 2. Industrial Processes & Product Use
  [ProjectionSummarySector.IPPU]: [
    ProjectionLeafSection.MINERAL_INDUSTRY,
    ProjectionLeafSection.CHEMICAL_INDUSTRY,
    ProjectionLeafSection.METAL_INDUSTRY,
    ProjectionLeafSection.NON_ENERGY_PRODUCTS,
    ProjectionLeafSection.ELECTRONICS_INDUSTRY,
    ProjectionLeafSection.SUBSTITUTES_OZONE,
    ProjectionLeafSection.OTHER_MANUFACTURE,
    ProjectionLeafSection.OTHER_INDUSTRIAL,
  ],
  // 3. Agriculture, Forestry, and Other Land Use
  [ProjectionSummarySector.AFOLU]: [
    ProjectionLeafSection.ENTERIC_FERMENTATION,
    ProjectionLeafSection.MANURE_MANAGEMENT,
    ProjectionLeafSection.FOREST_LAND,
    ProjectionLeafSection.CROPLAND,
    ProjectionLeafSection.GRASSLAND,
    ProjectionLeafSection.WETLANDS,
    ProjectionLeafSection.SETTLEMENTS,
    ProjectionLeafSection.OTHER_LAND,
    ProjectionLeafSection.AGG_SOURCE,
    ProjectionLeafSection.OTHER_AGR,
  ],
  // 4. Waste
  [ProjectionSummarySector.WASTE]: [
    ProjectionLeafSection.SOLID_WASTE,
    ProjectionLeafSection.BIOLOGICAL_TREATMENT,
    ProjectionLeafSection.INCINERATION_BURNING,
    ProjectionLeafSection.WASTEWATER_TREATMENT,
    ProjectionLeafSection.OTHER_WASTE,
  ],
  // 5. Other
  [ProjectionSummarySector.OTHER]: [
    ProjectionLeafSection.INDIRECT_N2O,
    ProjectionLeafSection.OTHER,
  ],
};

/** Human-readable category names for Excel export */
export const LEAF_CATEGORY_NAMES: Record<ProjectionLeafSection, string> = {
  // Energy
  [ProjectionLeafSection.ENERGY_INDUSTRIES]: 'Energy Industries',
  [ProjectionLeafSection.MANUFACTURING_CONSTRUCTION]: 'Manufacturing Industries and Construction',
  [ProjectionLeafSection.CIVIL_AVIATION]: 'Civil Aviation',
  [ProjectionLeafSection.ROAD_TRANSPORTATION]: 'Road Transportation',
  [ProjectionLeafSection.RAILWAYS]: 'Railways',
  [ProjectionLeafSection.WATER_NAVIGATION]: 'Water-borne Navigation',
  [ProjectionLeafSection.OTHER_TRANSPORTATION]: 'Other Transportation',
  [ProjectionLeafSection.OTHER_SECTORS]: 'Other Sectors',
  [ProjectionLeafSection.NON_SPECIFIED]: 'Non-Specified',
  [ProjectionLeafSection.SOLID_FUELS]: 'Solid Fuels',
  [ProjectionLeafSection.OIL_NATURAL_GAS]: 'Oil and Natural Gas',
  [ProjectionLeafSection.OTHER_EMISSIONS]: 'Other Emissions from Energy Production',
  [ProjectionLeafSection.TRANSPORT_CO2]: 'Transport of CO2',
  [ProjectionLeafSection.INJECTION_STORAGE]: 'Injection and Storage',
  [ProjectionLeafSection.OTHER_CO2]: 'Other (CO2)',
  
  // IPPU
  [ProjectionLeafSection.MINERAL_INDUSTRY]: 'Mineral Industry',
  [ProjectionLeafSection.CHEMICAL_INDUSTRY]: 'Chemical Industry',
  [ProjectionLeafSection.METAL_INDUSTRY]: 'Metal Industry',
  [ProjectionLeafSection.NON_ENERGY_PRODUCTS]: 'Non-Energy Products from Fuels and Solvent Use',
  [ProjectionLeafSection.ELECTRONICS_INDUSTRY]: 'Electronics Industry',
  [ProjectionLeafSection.SUBSTITUTES_OZONE]: 'Product Uses as Substitutes for Ozone Depleting Substances',
  [ProjectionLeafSection.OTHER_MANUFACTURE]: 'Other Product Manufacture and Use',
  [ProjectionLeafSection.OTHER_INDUSTRIAL]: 'Other (Industrial)',
  
  // AFOLU
  [ProjectionLeafSection.ENTERIC_FERMENTATION]: 'Enteric Fermentation',
  [ProjectionLeafSection.MANURE_MANAGEMENT]: 'Manure Management',
  [ProjectionLeafSection.FOREST_LAND]: 'Forest Land',
  [ProjectionLeafSection.CROPLAND]: 'Cropland',
  [ProjectionLeafSection.GRASSLAND]: 'Grassland',
  [ProjectionLeafSection.WETLANDS]: 'Wetlands',
  [ProjectionLeafSection.SETTLEMENTS]: 'Settlements',
  [ProjectionLeafSection.OTHER_LAND]: 'Other Land',
  [ProjectionLeafSection.AGG_SOURCE]: 'Aggregate Sources and Non-CO2 Emissions on Land',
  [ProjectionLeafSection.OTHER_AGR]: 'Other (Agriculture)',
  
  // Waste
  [ProjectionLeafSection.SOLID_WASTE]: 'Solid Waste Disposal',
  [ProjectionLeafSection.BIOLOGICAL_TREATMENT]: 'Biological Treatment of Solid Waste',
  [ProjectionLeafSection.INCINERATION_BURNING]: 'Incineration and Open Burning of Waste',
  [ProjectionLeafSection.WASTEWATER_TREATMENT]: 'Wastewater Treatment and Discharge',
  [ProjectionLeafSection.OTHER_WASTE]: 'Other (Waste)',
  
  // Other
  [ProjectionLeafSection.INDIRECT_N2O]: 'Indirect N2O Emissions',
  [ProjectionLeafSection.OTHER]: 'Other',
};

// ============================================================================
// REDOVI PODATAKA
// ============================================================================

/** Red za Summary sheet */
export interface ProjectionSummaryRow {
  sector: ProjectionSummarySector;
  /** Emisije po godinama (kt CO2 eq), ključ = godina */
  values: Record<number, number>;
}

/** Red za sektorski sheet */
export interface ProjectionSectorRow {
  /** Ključ iz ProjectionLeafSection enum-a */
  leafKey: ProjectionLeafSection;
  /** Čitljiv naziv kategorije */
  categoryName: string;
  /** Emisije (kt CO2 eq), indeks 0 = 2000, indeks 50 = 2050 */
  values: number[];
}

/** Podaci za jedan sektorski sheet */
export interface ProjectionSectorSheet {
  sectorName: ProjectionSummarySector;
  rows: ProjectionSectorRow[];
}

// ============================================================================
// GLAVNI DATASET
// ============================================================================

/**
 * Kompletan dataset za generisanje Excel-a
 * 
 * Summary sheet: summaryRows × summaryYears
 * Sektorski sheet-ovi: sectorSheets[].rows × detailYears
 */
export interface ProjectionExportDataset {
  scenarioType: ProjectionScenarioType;
  scenarioLabel: string;
  
  /** Godine za Summary sheet (2000, 2005, ..., 2050) */
  summaryYears: number[];
  /** Godine za sektorske sheet-ove (2000, 2001, ..., 2050) */
  detailYears: number[];
  
  /** Podaci za Summary sheet - agregacija po sektorima */
  summaryRows: ProjectionSummaryRow[];
  /** Podaci za individualne sektorske sheet-ove */
  sectorSheets: ProjectionSectorSheet[];
  
  generatedAt: Date;
}

// ============================================================================
// AGREGACIONA FUNKCIJA
// ============================================================================

/** Fiksiran redoslijed sektora za Summary sheet */
const SECTOR_ORDER: ProjectionSummarySector[] = [
  ProjectionSummarySector.ENERGY,
  ProjectionSummarySector.IPPU,
  ProjectionSummarySector.AFOLU,
  ProjectionSummarySector.WASTE,
  ProjectionSummarySector.OTHER,
];

/**
 * Gradi summary redove agregirajući sektorske podatke po godinama
 * 
 * Čista funkcija bez side-efekata - samo agregacija podataka.
 * 
 * @param sectorSheets - Podaci po sektorima sa leaf kategorijama
 * @param summaryYears - Godine za koje treba agregirati (npr. [2000, 2005, ..., 2050])
 * @returns Agregirani podaci po sektorima za summary sheet
 */
export function buildSummaryRows(
  sectorSheets: ProjectionSectorSheet[],
  summaryYears: number[],
): ProjectionSummaryRow[] {
  // Mapa za brži pristup sektorskim podacima
  const sheetsBySector = new Map<ProjectionSummarySector, ProjectionSectorSheet>();
  for (const sheet of sectorSheets) {
    sheetsBySector.set(sheet.sectorName, sheet);
  }

  return SECTOR_ORDER.map((sector): ProjectionSummaryRow => {
    const sheet = sheetsBySector.get(sector);
    const values: Record<number, number> = {};

    for (const year of summaryYears) {
      const yearIndex = year - PROJECTION_START_YEAR;

      if (!sheet?.rows?.length) {
        // Sektor nema podatke - vraćamo 0
        values[year] = 0;
        continue;
      }

      // Sumiramo sve leaf kategorije za datu godinu
      let sum = 0;
      for (const row of sheet.rows) {
        const val = row.values?.[yearIndex];
        // Tretiramo null, undefined, NaN kao 0
        if (val != null && !Number.isNaN(val)) {
          sum += val;
        }
      }
      values[year] = sum;
    }

    return { sector, values };
  });
}

// ============================================================================
// NOTE: getProjectionExportDataset is implemented in:
// src/projection/projection-export.service.ts (ProjectionExportService)
// ============================================================================
