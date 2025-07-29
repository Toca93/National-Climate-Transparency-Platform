import { annexTwoReportSQL } from "../entities/annexTwo.view.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

// Function to sum JSONB arrays element-wise
const sum_emission_arrays_fn = `
CREATE OR REPLACE FUNCTION sum_emission_arrays_fn(arr1 jsonb, arr2 jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb[];
    max_len integer;
    val1 numeric;
    val2 numeric;
    i integer;
BEGIN
    -- Handle null cases
    IF arr1 IS NULL AND arr2 IS NULL THEN
        RETURN NULL;
    END IF;
    IF arr1 IS NULL THEN
        RETURN arr2;
    END IF;
    IF arr2 IS NULL THEN
        RETURN arr1;
    END IF;
    
    -- Handle non-array cases
    IF jsonb_typeof(arr1) != 'array' OR jsonb_typeof(arr2) != 'array' THEN
        RETURN COALESCE(arr1, arr2);
    END IF;
    
    -- Get the maximum length
    max_len := GREATEST(jsonb_array_length(arr1), jsonb_array_length(arr2));
    result := ARRAY[]::jsonb[];
    
    -- Sum element by element
    FOR i IN 0..(max_len - 1) LOOP
        -- Get values, defaulting to 0 if index doesn't exist
        val1 := COALESCE((arr1->i)::numeric, 0);
        val2 := COALESCE((arr2->i)::numeric, 0);
        
        -- Add the summed value to result array
        result := result || to_jsonb(val1 + val2);
    END LOOP;
    
    RETURN to_jsonb(result);
END;
$$;`;

// Function to subtract JSONB arrays element-wise
const subtract_emission_arrays_fn = `
CREATE OR REPLACE FUNCTION subtract_emission_arrays_fn(arr1 jsonb, arr2 jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb[];
    max_len integer;
    val1 numeric;
    val2 numeric;
    i integer;
BEGIN
    -- Handle null cases
    IF arr1 IS NULL AND arr2 IS NULL THEN
        RETURN NULL;
    END IF;
    IF arr1 IS NULL THEN
        RETURN arr2;
    END IF;
    IF arr2 IS NULL THEN
        RETURN arr1;
    END IF;
    
    -- Handle non-array cases
    IF jsonb_typeof(arr1) != 'array' OR jsonb_typeof(arr2) != 'array' THEN
        RETURN COALESCE(arr1, arr2);
    END IF;
    
    -- Get the maximum length
    max_len := GREATEST(jsonb_array_length(arr1), jsonb_array_length(arr2));
    result := ARRAY[]::jsonb[];
    
    -- Subtract element by element
    FOR i IN 0..(max_len - 1) LOOP
        -- Get values, defaulting to 0 if index doesn't exist
        val1 := COALESCE((arr1->i)::numeric, 0);
        val2 := COALESCE((arr2->i)::numeric, 0);
        
        -- Add the summed value to result array
        result := result || to_jsonb(val1 - val2);
    END LOOP;
    
    RETURN to_jsonb(result);
END;
$$;`;

// Create aggregate function that uses the sum_emission_arrays_fn
const sum_emission_arrays_agg_fn = `
CREATE OR REPLACE AGGREGATE sum_emission_arrays_agg_fn(jsonb) (
    SFUNC = sum_emission_arrays_fn,
    STYPE = jsonb
);`;

// Create aggregate function that uses the subtract_emission_arrays_fn
const subtract_emission_arrays_agg_fn = `
CREATE OR REPLACE AGGREGATE subtract_emission_arrays_agg_fn(jsonb) (
    SFUNC = subtract_emission_arrays_fn,
    STYPE = jsonb
);`;

export class AnnexTwoView1753675946113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(sum_emission_arrays_fn);
    await queryRunner.query(sum_emission_arrays_agg_fn);
    await queryRunner.query(subtract_emission_arrays_fn);
    await queryRunner.query(subtract_emission_arrays_agg_fn);
    await queryRunner.query(
      "CREATE VIEW annex_two_view AS" + "\n" + annexTwoReportSQL
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP VIEW IF EXISTS annex_two_view");
    await queryRunner.query(
      "DROP AGGREGATE IF EXISTS sum_emission_arrays_agg_fn(jsonb)"
    );
    await queryRunner.query(
      "DROP FUNCTION IF EXISTS sum_emission_arrays_fn(jsonb, jsonb)"
    );
  }
}
