import { Index, ViewColumn, ViewEntity } from "typeorm";

export const cbtViewSQL = `
SELECT 
    cbt.id,
    -- H1 - Osnovne informacije o projektu
    cbt."projectName",
    cbt."startYear",
    cbt."endYear",
    cbt."activityDescription",
    cbt."nationalImplementingEntities",
    cbt."internationalImplementingEntities",
    cbt."recipientEntity",
    cbt.status,
    cbt.sector,
    cbt."subSector",
    cbt."otherSectorText",
    cbt."basedOnNDC",
    cbt."technologyTransferContribution",
    cbt."capacityBuildingContribution",
    cbt."typeOfSupport",
    cbt."additionalInformation" AS "projectAdditionalInformation",
    
    -- H7 - Status verifikacije
    cbt."verificationStatus",
    cbt."verificationNote",
    cbt.documents,
    
    -- Agregirani podaci iz cbt_funding (finansijski instrumenti)
    -- Convert comma-separated strings back to arrays
    CASE WHEN funding."financialInstrumentsStr" IS NOT NULL 
         THEN string_to_array(funding."financialInstrumentsStr", ',') 
         ELSE NULL END AS "financialInstruments",
    CASE WHEN funding."fundingStatusesStr" IS NOT NULL 
         THEN string_to_array(funding."fundingStatusesStr", ',') 
         ELSE NULL END AS "fundingStatuses",
    CASE WHEN funding."supportTypesStr" IS NOT NULL 
         THEN string_to_array(funding."supportTypesStr", ',') 
         ELSE NULL END AS "supportTypes",
    CASE WHEN funding."fundingMethodsStr" IS NOT NULL 
         THEN string_to_array(funding."fundingMethodsStr", ',') 
         ELSE NULL END AS "fundingMethods",
    funding."otherFundingMethodText",
    funding."expectedImpacts",
    
    -- Agregirani podaci iz cbt_instruments (finansijske sume)
    instruments."totalAmount",
    instruments."convertedAmount",
    instruments."nationalComponent",
    instruments."internationalComponent",
    instruments."exchangeRate",
    instruments."instrumentsAdditionalInformation",
    
    -- Datumi
    cbt."createdTime",
    cbt."updatedTime"
FROM 
    cbt cbt
LEFT JOIN (
    SELECT 
        cf."projectId",
        -- Use string_agg for enums to avoid PostgreSQL enum array formatting issues
        STRING_AGG(DISTINCT cf."financialInstrument"::text, ',') FILTER (WHERE cf."financialInstrument" IS NOT NULL) AS "financialInstrumentsStr",
        STRING_AGG(DISTINCT cf.status::text, ',') FILTER (WHERE cf.status IS NOT NULL) AS "fundingStatusesStr",
        STRING_AGG(DISTINCT cf."supportNeededOrReceived"::text, ',') FILTER (WHERE cf."supportNeededOrReceived" IS NOT NULL) AS "supportTypesStr",
        STRING_AGG(DISTINCT cf."fundingMethod"::text, ',') FILTER (WHERE cf."fundingMethod" IS NOT NULL) AS "fundingMethodsStr",
        STRING_AGG(DISTINCT cf."otherFundingMethodText", '; ') FILTER (WHERE cf."otherFundingMethodText" IS NOT NULL) AS "otherFundingMethodText",
        STRING_AGG(cf."expectedImpact", '; ') FILTER (WHERE cf."expectedImpact" IS NOT NULL) AS "expectedImpacts"
    FROM 
        cbt_funding cf
    GROUP BY 
        cf."projectId"
) funding ON cbt.id = funding."projectId"
LEFT JOIN (
    SELECT 
        ci."projectId",
        SUM(ci."totalAmount") AS "totalAmount",
        SUM(ci."convertedAmount") AS "convertedAmount",
        SUM(ci."nationalComponent") AS "nationalComponent",
        SUM(ci."internationalComponent") AS "internationalComponent",
        AVG(ci."exchangeRate") AS "exchangeRate",
        STRING_AGG(ci."additionalInformation", '; ') FILTER (WHERE ci."additionalInformation" IS NOT NULL) AS "instrumentsAdditionalInformation"
    FROM 
        cbt_instruments ci
    GROUP BY 
        ci."projectId"
) instruments ON cbt.id = instruments."projectId";
`;

@ViewEntity({
  name: "cbt_view",
  expression: cbtViewSQL,
  synchronize: false,
})
export class CBTView {
  @ViewColumn()
  id: string;

  // H1 - Osnovne informacije o projektu
  @ViewColumn()
  projectName: string;

  @ViewColumn()
  startYear: number;

  @ViewColumn()
  endYear: number;

  @ViewColumn()
  activityDescription: string;

  @ViewColumn()
  nationalImplementingEntities: string[];

  @ViewColumn()
  internationalImplementingEntities: string[];

  @ViewColumn()
  recipientEntity: string;

  @ViewColumn()
  status: string;

  @ViewColumn()
  sector: string;

  @ViewColumn()
  subSector: string[];

  @ViewColumn()
  otherSectorText: string;

  @ViewColumn()
  basedOnNDC: string;

  @ViewColumn()
  technologyTransferContribution: string;

  @ViewColumn()
  capacityBuildingContribution: string;

  @ViewColumn()
  typeOfSupport: string;

  @ViewColumn()
  projectAdditionalInformation: string;

  // H7 - Status verifikacije
  @ViewColumn()
  verificationStatus: string;

  @ViewColumn()
  verificationNote: string;

  @ViewColumn()
  documents: string[];

  // Podaci iz cbt_funding
  @ViewColumn()
  financialInstruments: string[];

  @ViewColumn()
  fundingStatuses: string[];

  @ViewColumn()
  supportTypes: string[];

  @ViewColumn()
  fundingMethods: string[];

  @ViewColumn()
  otherFundingMethodText: string;

  @ViewColumn()
  expectedImpacts: string;

  // Podaci iz cbt_instruments (finansijske sume)
  @ViewColumn()
  totalAmount: number;

  @ViewColumn()
  convertedAmount: number;

  @ViewColumn()
  nationalComponent: number;

  @ViewColumn()
  internationalComponent: number;

  @ViewColumn()
  exchangeRate: number;

  @ViewColumn()
  instrumentsAdditionalInformation: string;

  // Datumi
  @ViewColumn()
  createdTime: Date;

  @ViewColumn()
  updatedTime: Date;
}
