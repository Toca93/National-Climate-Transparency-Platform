import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCBTTable1737628800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create CBT status enum
    await queryRunner.query(`
      CREATE TYPE "cbt_status_enum" AS ENUM ('Planned', 'Ongoing', 'Completed', 'Cancelled');
    `);

    // Create verification status enum
    await queryRunner.query(`
      CREATE TYPE "cbt_verification_status_enum" AS ENUM ('Unverified', 'InternallyVerified', 'BTRReady');
    `);

    // Create CBT table
    await queryRunner.query(`
      CREATE TABLE "cbt" (
        "id" character varying NOT NULL,
        "reportingYear" integer NOT NULL,
        "projectName" character varying NOT NULL,
        "activityDescription" text,
        "responsibleInstitution" character varying,
        "status" "cbt_status_enum" NOT NULL DEFAULT 'Planned',
        "validated" boolean NOT NULL DEFAULT false,
        "verificationStatus" "cbt_verification_status_enum" DEFAULT 'Unverified',
        "verificationNote" character varying,
        "contractDocuments" text[],
        "governmentDecisionDocuments" text[],
        "donorAgreementDocuments" text[],
        "createdTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_cbt" PRIMARY KEY ("id")
      );
    `);

    // Create index for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_cbt_reportingYear" ON "cbt" ("reportingYear");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_cbt_status" ON "cbt" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_cbt_status";`);
    await queryRunner.query(`DROP INDEX "IDX_cbt_reportingYear";`);
    await queryRunner.query(`DROP TABLE "cbt";`);
    await queryRunner.query(`DROP TYPE "cbt_verification_status_enum";`);
    await queryRunner.query(`DROP TYPE "cbt_status_enum";`);
  }
}
