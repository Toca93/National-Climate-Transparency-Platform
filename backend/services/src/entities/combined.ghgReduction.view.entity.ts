import { GHGS, IpccSubSector } from "../enums/shared.enum";
import { Index, ViewColumn, ViewEntity } from "typeorm";

export const combinedGhgReductionViewSQL = `
SELECT
	"ipccSubSector",
	("extendedMitigationTimeline" ->> 'unit') AS unit,
	("extendedMitigationTimeline" -> 'actual' -> 'actualEmissionReduct') AS "actualEmissionReduct",
	("extendedMitigationTimeline" -> 'actual' -> 'activityActualEmissions') AS "activityActualEmissions",
	("extendedMitigationTimeline" -> 'actual' -> 'baselineActualEmissions') AS "baselineActualEmissions",
	("extendedMitigationTimeline" -> 'expected' -> 'baselineEmissions') AS "baselineEmissions",
	("extendedMitigationTimeline" -> 'expected' -> 'activityEmissionsWithM') AS "activityEmissionsWithM",
	("extendedMitigationTimeline" -> 'expected' -> 'actualEmissionReduct') AS "actualEmissionReduction",
	("extendedMitigationTimeline" -> 'expected' -> 'activityEmissionsWithAM') AS "activityEmissionsWithAM",
	("extendedMitigationTimeline" -> 'expected' -> 'expectedEmissionReductWithM') AS "expectedEmissionReductWithM",
	("extendedMitigationTimeline" -> 'expected' -> 'expectedEmissionReductWithAM') AS "expectedEmissionReductWithAM",
	("extendedMitigationTimeline" ->> 'startYear') AS "startYear"
FROM  
	(
    SELECT
      atv."ipccSubSector",
      reset_startyear_fn(sum_jsonb_agg_fn(atv."extendedMitigationTimeline"), 2000) AS "extendedMitigationTimeline"
    FROM 
    (
      SELECT 
        "ipccSubSector",
        subltree(path, 0, 1)::character varying AS action,
        extend_emission_arrays_fn("mitigationTimeline", 2000) AS "extendedMitigationTimeline"
      FROM
        activity 
      WHERE
        "parentId" IS NOT NULL
        AND "ipccSubSector" IS NOT NULL
        AND "validated" IS TRUE
        AND activity."mitigationTimeline" IS NOT NULL
    ) atv
    LEFT JOIN action
    ON atv.action = action."actionId"
    GROUP BY 
      "ipccSubSector"
  )
;`;

@ViewEntity({
  name: "combined_ghg_reduction_view_entity",
  materialized: true,
  expression: combinedGhgReductionViewSQL,
  synchronize: false,
})
@Index("idx_combined_ghg_reduction_view_entity_id")
export class CombinedGhgReductionViewEntity {
  @ViewColumn()
  ipccSubSector: IpccSubSector;

  @ViewColumn()
  unit: GHGS;

  @ViewColumn()
  actualEmissionReduct?: Array<number>;

  @ViewColumn()
  activityActualEmissions?: Array<number>;

  @ViewColumn()
  baselineActualEmissions?: Array<number>;

  @ViewColumn()
  baselineEmissions?: Array<number>;

  @ViewColumn()
  activityEmissionsWithM?: Array<number>;

  @ViewColumn()
  actualEmissionReduction?: Array<number>;

  @ViewColumn()
  activityEmissionsWithAM?: Array<number>;

  @ViewColumn()
  expectedEmissionReductWithM?: Array<number>;

  @ViewColumn()
  expectedEmissionReductWithAM?: Array<number>;

  @ViewColumn()
  startYear: string;
}
