import { actionViewSQL } from "../entities/action.view.entity";
import { activityViewSQL } from "../entities/activity.view.entity";
import { annexThreeReportSQL } from "../entities/annexThree.view.entity";
import { programmeViewSQL } from "../entities/programme.view.entity";
import { projectViewSQL } from "../entities/project.view.entity";
import { reportFiveViewSQL } from "../entities/report.five.view.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAllViews1763982449636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS annex_three_view`); // Dropping the report five view entity
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS report_five_view_entity`); // Dropping the report five view entity
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS action_view_entity`); // Dropping the action view entity 
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS programme_view_entity`); // Dropping the programme view entity
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS project_view_entity`); // Dropping the project view entity
        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS activity_view_entity`); // Dropping the activity view entity
        
        await queryRunner.query("CREATE MATERIALIZED VIEW activity_view_entity AS" + "\n" + activityViewSQL); // Creating the activity view entity
        await queryRunner.query("CREATE MATERIALIZED VIEW project_view_entity AS" + "\n" + projectViewSQL); // Creating the project view entity
        await queryRunner.query("CREATE MATERIALIZED VIEW programme_view_entity AS" + "\n" + programmeViewSQL); // Creating the programme view entity
        await queryRunner.query("CREATE MATERIALIZED VIEW action_view_entity AS" + "\n" + actionViewSQL); // Creating the action view entity 
        await queryRunner.query("CREATE MATERIALIZED VIEW report_five_view_entity AS" + "\n" + reportFiveViewSQL); // Creating the report five entity
        await queryRunner.query("CREATE VIEW annex_three_view AS" + "\n" + annexThreeReportSQL); // Creating the annex three view

        await queryRunner.query(`
            CREATE UNIQUE INDEX idx_activity_view_entity_id ON activity_view_entity(id);
            CREATE UNIQUE INDEX idx_project_view_entity_id ON project_view_entity(id);
            CREATE UNIQUE INDEX idx_programme_view_entity_id ON programme_view_entity(id);
            CREATE UNIQUE INDEX idx_action_view_entity_id ON action_view_entity(id);
            CREATE UNIQUE INDEX idx_report_five_view_entity_id ON report_five_view_entity(source, "actionId");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
