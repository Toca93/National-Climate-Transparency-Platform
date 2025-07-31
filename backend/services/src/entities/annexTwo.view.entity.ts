import { ReportCategoryType } from "../enums/report.category.type.enum";
import { ExtendedProjectionType } from "../enums/projection.enum";
import { Index, ViewColumn, ViewEntity } from "typeorm";

const sectoredProjections = `
SELECT
	sector,
	(sum_emission_arrays_agg_fn(CASE WHEN "projectionType" = '${ExtendedProjectionType.WITH_MEASURES}' THEN projection_array END)) AS "${ExtendedProjectionType.WITH_MEASURES}",
	(sum_emission_arrays_agg_fn(CASE WHEN "projectionType" = '${ExtendedProjectionType.WITHOUT_MEASURES}' THEN projection_array END)) AS "${ExtendedProjectionType.WITHOUT_MEASURES}",
	(sum_emission_arrays_agg_fn(CASE WHEN "projectionType" = '${ExtendedProjectionType.BASELINE_WITH_MEASURES}' THEN projection_array END)) AS "${ExtendedProjectionType.BASELINE_WITH_MEASURES}"
FROM
	(
		SELECT
		p."projectionType",
		json_data.key AS sector,
		json_data.value AS projection_array
		FROM
		projection_entity p,
		LATERAL jsonb_each(p."projectionData") AS json_data
	)
GROUP BY
	sector
ORDER BY
	sector`;

const sectoredEmissionImpact = `
SELECT 
	sector,
	(subtract_emission_arrays_fn("${ExtendedProjectionType.WITHOUT_MEASURES}"::jsonb,"expectedEmissionReductWithM"::jsonb)) AS "${ExtendedProjectionType.WITH_MEASURES}",
	(subtract_emission_arrays_fn("${ExtendedProjectionType.WITHOUT_MEASURES}"::jsonb,"expectedEmissionReductWithAM"::jsonb)) AS "${ExtendedProjectionType.WITH_ADDITIONAL_MEASURES}",
	"${ExtendedProjectionType.WITHOUT_MEASURES}"
FROM
	(${sectoredProjections}) projections
LEFT JOIN
	(
		SELECT
			split_part("ipccSubSector",' ',1) AS "ipccSubSector",
			"expectedEmissionReductWithM",
			"expectedEmissionReductWithAM"
		FROM
			combined_ghg_reduction_view_entity
	) cgr
ON
	cgr."ipccSubSector" = projections.sector
`;

const annexTwoReportConfig = `
SELECT 
	value as category,
	key as "subSector" 
FROM 
	configuration_settings, jsonb_each_text("settingValue" )
WHERE
	Id = 'ANNEX_II_REPORT_CATEGORIES'
`

export const annexTwoReportSQL = `
SELECT
	category,
	sum_emission_arrays_agg_fn("${ExtendedProjectionType.WITH_MEASURES}") AS "withM",
	sum_emission_arrays_agg_fn("${ExtendedProjectionType.WITH_ADDITIONAL_MEASURES}") AS "withAM",
	sum_emission_arrays_agg_fn("${ExtendedProjectionType.WITHOUT_MEASURES}") AS "withoutM"
FROM
    (${sectoredEmissionImpact}) impact
INNER JOIN
	(${annexTwoReportConfig}) config
ON
	impact.sector = config."subSector"
GROUP BY
	category;
`;

@ViewEntity({
  name: "annex_two_view",
  materialized: false,
  expression: annexTwoReportSQL,
  synchronize: false,
})
export class AnnexTwoViewEntity {
  @Index()
  @ViewColumn()
  category: ReportCategoryType;

  @ViewColumn()
  withM: Array<number> | null;

  @ViewColumn()
  withAM: Array<number> | null;

  @ViewColumn()
  withoutM: Array<number> | null;
}
