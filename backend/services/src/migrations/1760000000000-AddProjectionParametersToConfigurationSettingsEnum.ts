import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectionParametersToConfigurationSettingsEnum1760000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "configuration_settings_id_enum" ADD VALUE IF NOT EXISTS 'PROJECTION_PARAMETERS'`
    );
  }

  public async down(): Promise<void> {
    // Postgres enums cannot safely remove values; no-op.
  }
}

