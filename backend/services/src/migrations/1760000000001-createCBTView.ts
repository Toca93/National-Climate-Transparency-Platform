import { MigrationInterface, QueryRunner } from "typeorm";
import { cbtViewSQL } from "../entities/cbt.view.entity";

export class CreateCBTView1760000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS cbt_view`);
        
        await queryRunner.query("CREATE VIEW cbt_view AS" + "\n" + cbtViewSQL);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS cbt_view`);
    }

}
