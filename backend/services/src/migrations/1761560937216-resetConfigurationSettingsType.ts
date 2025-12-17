import { annexTwoReportSQL } from "../entities/annexTwo.view.entity";
import { ConfigurationSettingsType } from "../enums/configuration.settings.type.enum";
import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetConfigurationSettingsType1761560937216
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TEMP TABLE configuration_settings_backup AS 
            SELECT id::text as id, "settingValue", "createdTime", "updatedTime" 
            FROM configuration_settings
        `);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "configuration_settings" CASCADE`
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "configuration_settings_id_enum" CASCADE`
    );
    await queryRunner.query(`
      CREATE TYPE "configuration_settings_id_enum" AS ENUM(
        '${ConfigurationSettingsType.GWP}',
        '${ConfigurationSettingsType.PROJECTIONS_WITH_MEASURES}',
        '${ConfigurationSettingsType.PROJECTIONS_WITH_ADDITIONAL_MEASURES}',
        '${ConfigurationSettingsType.PROJECTIONS_WITHOUT_MEASURES}',
        '${ConfigurationSettingsType.ANNEX_II_REPORT_CATEGORIES}',
        '${ConfigurationSettingsType.SECTOR_YEAR_CONFIGURATION}'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "configuration_settings" (
        id "configuration_settings_id_enum" NOT NULL,
        "settingValue" jsonb,
        "createdTime" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedTime" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);
    await queryRunner.query(`
      INSERT INTO "configuration_settings" (id, "settingValue", "createdTime", "updatedTime")
      SELECT id::"configuration_settings_id_enum", "settingValue", "createdTime", "updatedTime"
      FROM configuration_settings_backup
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS configuration_settings_backup`);

    await queryRunner.query(
          "CREATE VIEW annex_two_view AS" + "\n" + annexTwoReportSQL
        );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
