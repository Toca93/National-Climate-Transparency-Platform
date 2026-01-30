import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCBTSubTables1738300800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(`
      CREATE TYPE "cbt_sector_enum" AS ENUM ('Energy', 'Transport', 'Industry', 'Agriculture', 'Forestry', 'WaterAndSanitation', 'CrossCutting', 'Other');
    `);

    await queryRunner.query(`
      CREATE TYPE "financial_instrument_enum" AS ENUM ('Grant', 'ConcessionalLoan', 'NonConcessionalLoan', 'Equity', 'Guarantee', 'Insurance', 'Other');
    `);

    await queryRunner.query(`
      CREATE TYPE "support_type_enum" AS ENUM ('Adaptation', 'Mitigation', 'CrossCutting');
    `);

    await queryRunner.query(`
      CREATE TYPE "finance_channel_enum" AS ENUM ('Multilateral', 'Bilateral', 'Regional', 'Other');
    `);

    await queryRunner.query(`
      CREATE TYPE "finance_status_enum" AS ENUM ('Committed', 'Received');
    `);

    await queryRunner.query(`
      CREATE TYPE "activity_status_enum" AS ENUM ('Planned', 'Ongoing', 'Completed');
    `);

    // Table III.6 - Financial Support Needed
    await queryRunner.query(`
      CREATE TABLE "cbt_finance_needed" (
        "id" character varying NOT NULL,
        "cbtId" character varying,
        "sector" "cbt_sector_enum",
        "subsector" character varying,
        "title" character varying,
        "description" text,
        "estimatedAmountDomestic" decimal(18,2),
        "estimatedAmountUSD" decimal(18,2),
        "expectedTimeFrame" character varying,
        "financialInstrument" "financial_instrument_enum",
        "financialInstrumentOther" character varying,
        "supportType" "support_type_enum",
        "techDevContribution" boolean DEFAULT false,
        "capacityBuildingContribution" boolean DEFAULT false,
        "anchoredInNationalStrategy" boolean DEFAULT false,
        "expectedUseImpact" text,
        "additionalInfo" text,
        "createdBy" character varying,
        "createdTime" bigint,
        "updatedBy" character varying,
        "updatedTime" bigint,
        CONSTRAINT "PK_cbt_finance_needed" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cbt_finance_needed_cbt" FOREIGN KEY ("cbtId") REFERENCES "cbt"("id") ON DELETE CASCADE
      );
    `);

    // Table III.7 - Financial Support Received
    await queryRunner.query(`
      CREATE TABLE "cbt_finance_received" (
        "id" character varying NOT NULL,
        "cbtId" character varying,
        "title" character varying,
        "description" text,
        "channel" "finance_channel_enum",
        "channelOther" character varying,
        "recipientEntity" character varying,
        "implementingEntity" character varying,
        "amountDomestic" decimal(18,2),
        "amountUSD" decimal(18,2),
        "timeFrame" character varying,
        "financialInstrument" "financial_instrument_enum",
        "financialInstrumentOther" character varying,
        "status" "finance_status_enum",
        "supportType" "support_type_enum",
        "sector" "cbt_sector_enum",
        "subsector" character varying,
        "techDevContribution" boolean DEFAULT false,
        "capacityBuildingContribution" boolean DEFAULT false,
        "activityStatus" "activity_status_enum",
        "useImpactResults" text,
        "additionalInfo" text,
        "createdBy" character varying,
        "createdTime" bigint,
        "updatedBy" character varying,
        "updatedTime" bigint,
        CONSTRAINT "PK_cbt_finance_received" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cbt_finance_received_cbt" FOREIGN KEY ("cbtId") REFERENCES "cbt"("id") ON DELETE CASCADE
      );
    `);

    // Table III.12 - Transparency Support Needed
    await queryRunner.query(`
      CREATE TABLE "cbt_transparency_needed" (
        "id" character varying NOT NULL,
        "cbtId" character varying,
        "title" character varying,
        "objectivesDescription" text,
        "expectedTimeFrame" character varying,
        "recipientEntity" character varying,
        "channel" "finance_channel_enum",
        "channelOther" character varying,
        "amountDomestic" decimal(18,2),
        "amountUSD" decimal(18,2),
        "activityStatus" "activity_status_enum",
        "expectedUseImpact" text,
        "additionalInfo" text,
        "createdBy" character varying,
        "createdTime" bigint,
        "updatedBy" character varying,
        "updatedTime" bigint,
        CONSTRAINT "PK_cbt_transparency_needed" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cbt_transparency_needed_cbt" FOREIGN KEY ("cbtId") REFERENCES "cbt"("id") ON DELETE CASCADE
      );
    `);

    // Table III.13 - Transparency Support Received
    await queryRunner.query(`
      CREATE TABLE "cbt_transparency_received" (
        "id" character varying NOT NULL,
        "cbtId" character varying,
        "title" character varying,
        "objectivesDescription" text,
        "timeFrame" character varying,
        "recipientEntity" character varying,
        "channel" "finance_channel_enum",
        "channelOther" character varying,
        "amountDomestic" decimal(18,2),
        "amountUSD" decimal(18,2),
        "activityStatus" "activity_status_enum",
        "useImpactResults" text,
        "additionalInfo" text,
        "createdBy" character varying,
        "createdTime" bigint,
        "updatedBy" character varying,
        "updatedTime" bigint,
        CONSTRAINT "PK_cbt_transparency_received" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cbt_transparency_received_cbt" FOREIGN KEY ("cbtId") REFERENCES "cbt"("id") ON DELETE CASCADE
      );
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_cbt_finance_needed_cbtId" ON "cbt_finance_needed" ("cbtId");`);
    await queryRunner.query(`CREATE INDEX "IDX_cbt_finance_received_cbtId" ON "cbt_finance_received" ("cbtId");`);
    await queryRunner.query(`CREATE INDEX "IDX_cbt_transparency_needed_cbtId" ON "cbt_transparency_needed" ("cbtId");`);
    await queryRunner.query(`CREATE INDEX "IDX_cbt_transparency_received_cbtId" ON "cbt_transparency_received" ("cbtId");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_cbt_transparency_received_cbtId";`);
    await queryRunner.query(`DROP INDEX "IDX_cbt_transparency_needed_cbtId";`);
    await queryRunner.query(`DROP INDEX "IDX_cbt_finance_received_cbtId";`);
    await queryRunner.query(`DROP INDEX "IDX_cbt_finance_needed_cbtId";`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "cbt_transparency_received";`);
    await queryRunner.query(`DROP TABLE "cbt_transparency_needed";`);
    await queryRunner.query(`DROP TABLE "cbt_finance_received";`);
    await queryRunner.query(`DROP TABLE "cbt_finance_needed";`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "activity_status_enum";`);
    await queryRunner.query(`DROP TYPE "finance_status_enum";`);
    await queryRunner.query(`DROP TYPE "finance_channel_enum";`);
    await queryRunner.query(`DROP TYPE "support_type_enum";`);
    await queryRunner.query(`DROP TYPE "financial_instrument_enum";`);
    await queryRunner.query(`DROP TYPE "cbt_sector_enum";`);
  }
}
