import { combinedGhgReductionViewSQL } from "../entities/combined.ghgReduction.view.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

// KL: Refer to the in SQL comments for specific meainings of each part
// KL: This function is the state transition function for the custom Aggregate sum_jsonb_agg_fn
const sum_json_recursively_fn = `
CREATE OR REPLACE FUNCTION sum_json_recursively_fn(obj1 jsonb, obj2 jsonb)
RETURNS jsonb AS $$
DECLARE
    res jsonb := '{}'::jsonb;
    key text;
    val1 jsonb;
    val2 jsonb;
    i int;
BEGIN
    -- If either object is null, return the other one
    IF obj1 IS NULL THEN RETURN obj2; END IF;
    IF obj2 IS NULL THEN RETURN obj1; END IF;

    -- Case 1: Both are numbers, so we sum them
    IF jsonb_typeof(obj1) = 'number' AND jsonb_typeof(obj2) = 'number' THEN
        RETURN to_jsonb(obj1::numeric + obj2::numeric);
    END IF;

    -- Case 2: Both are arrays, so we sum them element-wise
    IF jsonb_typeof(obj1) = 'array' AND jsonb_typeof(obj2) = 'array' THEN
        res := '[]'::jsonb;
        -- Ensure arrays are of the same length for simplicity, or add more complex handling
        FOR i IN 0..LEAST(jsonb_array_length(obj1), jsonb_array_length(obj2)) - 1 LOOP
            res := res || to_jsonb((obj1->>i)::numeric + (obj2->>i)::numeric);
        END LOOP;
        RETURN res;
    END IF;

    -- Case 3: Both are objects, so we recursively sum their children
    IF jsonb_typeof(obj1) = 'object' AND jsonb_typeof(obj2) = 'object' THEN
        -- Loop through all keys from both objects
        FOR key IN SELECT DISTINCT k FROM (SELECT jsonb_object_keys(obj1) AS k UNION ALL SELECT jsonb_object_keys(obj2) AS k) AS keys
        LOOP
            val1 := obj1->key;
            val2 := obj2->key;
            -- Recursively call the function on the child elements
            res := jsonb_set(res, ARRAY[key], sum_json_recursively_fn(val1, val2));
        END LOOP;
        RETURN res;
    END IF;

    -- Fallback: If types are mismatched or not summable, prefer the first non-null value
    RETURN COALESCE(obj1, obj2);
END;
$$ LANGUAGE plpgsql;`;

// KL: This aggregation will be used to aggregate the jsonb object mitigation timeline
const sum_jsonb_agg_fn = `
CREATE OR REPLACE AGGREGATE sum_jsonb_agg_fn(jsonb) (
    sfunc = sum_json_recursively_fn,
    stype = jsonb,
    initcond = '{}'
);`;

// KL: This function is to extend the emission arrays to start from a given year.
const extend_emission_arrays_fn = `
CREATE OR REPLACE FUNCTION extend_emission_arrays_fn(
    input_jsonb JSONB,
    new_start_year INTEGER
) RETURNS JSONB AS $$
DECLARE
    current_start_year INTEGER;
    years_to_add INTEGER;
    result_jsonb JSONB;
    zero_array JSONB;
    i INTEGER;
BEGIN
    -- Extract current start year
    current_start_year := (input_jsonb->>'startYear')::INTEGER;
    
    -- Calculate how many years (zeros) to add
    years_to_add := current_start_year - new_start_year;
    
    -- If new start year is not earlier, return original
    IF years_to_add <= 0 THEN
        RETURN input_jsonb;
    END IF;
    
    -- Create array of zeros to prepend
    zero_array := '[]'::JSONB;
    FOR i IN 1..years_to_add LOOP
        zero_array := zero_array || '0'::JSONB;
    END LOOP;
    
    -- Start with the input jsonb
    result_jsonb := input_jsonb;
    
    -- Update startYear
    result_jsonb := jsonb_set(result_jsonb, '{startYear}', to_jsonb(new_start_year));
    
    -- Extend arrays in actual section
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{actual,actualEmissionReduct}', 
        zero_array || (result_jsonb->'actual'->'actualEmissionReduct')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{actual,activityActualEmissions}', 
        zero_array || (result_jsonb->'actual'->'activityActualEmissions')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{actual,baselineActualEmissions}', 
        zero_array || (result_jsonb->'actual'->'baselineActualEmissions')
    );
    
    -- Extend arrays in expected section
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{expected,baselineEmissions}', 
        zero_array || (result_jsonb->'expected'->'baselineEmissions')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{expected,activityEmissionsWithM}', 
        zero_array || (result_jsonb->'expected'->'activityEmissionsWithM')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{expected,activityEmissionsWithAM}', 
        zero_array || (result_jsonb->'expected'->'activityEmissionsWithAM')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{expected,expectedEmissionReductWithM}', 
        zero_array || (result_jsonb->'expected'->'expectedEmissionReductWithM')
    );
    
    result_jsonb := jsonb_set(
        result_jsonb, 
        '{expected,expectedEmissionReductWithAM}', 
        zero_array || (result_jsonb->'expected'->'expectedEmissionReductWithAM')
    );
    
    RETURN result_jsonb;
END;
$$ LANGUAGE plpgsql;`;

// KL: Resets the startyear field in the given JSONB data to the provided value.
const reset_startyear_fn = `
CREATE OR REPLACE FUNCTION reset_startyear_fn(jsonb_data jsonb, new_startyear numeric)
RETURNS jsonb AS $$
BEGIN
    RETURN jsonb_set(jsonb_data, '{startYear}', to_jsonb(new_startyear), true);
END;
$$ LANGUAGE plpgsql;`;

export class CreateCombinedViews1752577073121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(extend_emission_arrays_fn);
    await queryRunner.query(sum_json_recursively_fn);
    await queryRunner.query(sum_jsonb_agg_fn);
    await queryRunner.query(reset_startyear_fn);
    
    await queryRunner.query(
        "CREATE MATERIALIZED VIEW combined_ghg_reduction_view_entity AS" +
        "\n" +
        combinedGhgReductionViewSQL
    );
    await queryRunner.query(`CREATE UNIQUE INDEX idx_combined_ghg_reduction_view_entity_id ON combined_ghg_reduction_view_entity("ipccSubSector");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DROP MATERIALIZED VIEW IF EXISTS combined_ghg_reduction_view_entity"
    );
    await queryRunner.query(
      "DROP FUNCTION IF EXISTS reset_startyear_fn(jsonb, numeric)"
    );
    await queryRunner.query("DROP AGGREGATE IF EXISTS sum_jsonb_agg_fn(jsonb)");
    await queryRunner.query(
      "DROP FUNCTION IF EXISTS sum_json_recursively_fn(jsonb, jsonb)"
    );
    await queryRunner.query(
      "DROP FUNCTION IF EXISTS extend_emission_arrays_fn(jsonb, jsonb)"
    );
  }
}
