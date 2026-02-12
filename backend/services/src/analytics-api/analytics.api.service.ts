import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataCountResponseDto } from "../dtos/data.count.response";
import { ActionEntity } from "../entities/action.entity";
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ProjectEntity } from "../entities/project.entity";
import { ActivityEntity } from "../entities/activity.entity";
import { SupportEntity } from "../entities/support.entity";
import { CBTEntity, CBTTypeOfSupport } from "../entities/cbt.entity";
import { CBTFundingEntity, CBTFundingInstrument, CBTFundingMethod } from "../entities/cbt.funding.entity";
import { FinanceNature, SupportDirection, IntSupChannel, IntFinInstrument } from "../enums/support.enum";
import { ActivityStatus } from "../enums/activity.enum";
import { ActionType } from "../enums/action.enum";
import { Sector } from "../enums/sector.enum";
import { HelperService } from "../util/helpers.service";

@Injectable()
export class AnalyticsService {

	constructor(
		@InjectEntityManager() private entityManager: EntityManager,
		@InjectRepository(ActivityEntity) private activityRepo: Repository<ActivityEntity>,
		private helperService: HelperService
	) { }

	async getClimateActionChart(): Promise<DataCountResponseDto> {
		try {
			const queryBuilder = this.entityManager.createQueryBuilder()
				.select('sector, COUNT("actionId") as count, MAX(action.updatedTime) as "latestTime"')
				.from(ActionEntity, 'action')
				.where('sector IS NOT NULL')
				.groupBy('sector')
				.orderBy('MAX(action.updatedTime)', 'DESC');

			const result = await queryBuilder.getRawMany();

			// Extract sectors and counts into separate arrays
			const sectors = result.map(row => row.sector);
			const counts = result.map(row => row.count);

			// Get the latest time from the first row if result is not empty
			const latestTime = result.length ? new Date(result[0].latestTime) : null;

			// Convert latestTime to epoch if it's not null
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors, counts }, latestEpoch);
		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}

	}

	async getProjectSummaryChart(): Promise<DataCountResponseDto> {
		try {
			const queryBuilder = this.entityManager.createQueryBuilder()
				.select('sector, COUNT("projectId") as count, MAX(project.updatedTime) as "latestTime"')
				.from(ProjectEntity, 'project')
				.where('sector IS NOT NULL')
				.groupBy('sector')
				.orderBy('MAX(project.updatedTime)', 'DESC');

			const result = await queryBuilder.getRawMany();

			// Extract sectors and counts into separate arrays
			const sectors = result.map(row => row.sector);
			const counts = result.map(row => row.count);

			// Get the latest time from the first row if result is not empty
			const latestTime = result.length ? new Date(result[0].latestTime) : null;

			// Convert latestTime to epoch if it's not null
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;


			return new DataCountResponseDto({ sectors, counts }, latestEpoch);
		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getActivitiesSupported() {
		try {
			const results = await this.activityRepo.createQueryBuilder('activity')
				.leftJoin('activity.support', 'support')
				.select([
					'COUNT(DISTINCT activity.activityId) as "totalActivities"',
					'COUNT(DISTINCT CASE WHEN support.financeNature = :financeNature AND support.direction = :directionReceived THEN activity.activityId END) as "supportReceivedActivities"',
					'GREATEST(MAX(activity."updatedTime"), MAX(support."updatedTime")) as "latestTime"'
				])
				.setParameter('financeNature', FinanceNature.INTERNATIONAL)
				.setParameter('directionReceived', SupportDirection.RECEIVED)
				.getRawOne();

			const totalActivities = results.totalActivities ? parseInt(results.totalActivities) : 0;
			const supportReceivedActivities = results.supportReceivedActivities ? parseInt(results.supportReceivedActivities) : 0;
			const supportNeededActivities = totalActivities - supportReceivedActivities;

			const latestTime = results.latestTime ? new Date(results.latestTime).getTime() / 1000 : 0;

			return new DataCountResponseDto({ supportReceivedActivities, supportNeededActivities }, latestTime);
		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getActivitiesFinance() {
		try {
			const results = await this.activityRepo.createQueryBuilder('activity')
				.leftJoin('activity.support', 'support')
				.select([
					'sum(support."receivedAmount") as "supportReceived"', 'sum(support."requiredAmount") as "supportNeeded"',
					'GREATEST(MAX(activity."updatedTime"), MAX(support."updatedTime")) as "latestTime"'
				])
				.getRawOne();

			const supportReceived = results.supportReceived ? parseFloat(results.supportReceived) : 0;
			const supportNeeded = results.supportNeeded ? parseFloat(results.supportNeeded) : 0;

			const latestTime = results.latestTime ? new Date(results.latestTime).getTime() / 1000 : 0;

			return new DataCountResponseDto({ supportReceived, supportNeeded }, latestTime);

		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getGhgMitigationForYear(year: number) {
		try {
			const query = `
				SELECT 
					activity.sector,
					SUM((activity."mitigationTimeline"->'expected'->'expectedEmissionReductWithM'->>(${year} - (activity."mitigationTimeline" ->> 'startYear')::int))::numeric) AS total,
					Max(activity."updatedTime") as "latestTime"
				FROM 
					activity
				WHERE activity.sector IS NOT NULL
					AND activity."mitigationTimeline" IS NOT NULL
					AND (activity."mitigationTimeline" ->> 'startYear')::numeric <= ${year}
				GROUP BY 
					activity.sector
				HAVING 
						SUM((activity."mitigationTimeline" -> 'expected' -> 'expectedEmissionReductWithM' ->> (${year} - (activity."mitigationTimeline" ->> 'startYear')::int))::numeric) != 0
				ORDER BY 
					"latestTime" DESC;
			`;

			const result = await this.entityManager.query(query);
			// Extract sectors and counts into separate arrays
			const sectors = result.map(row => row.sector);
			const totals = result.map(row => row.total);

			// Get the latest time from the first row if result is not empty
			const latestTime = result.length ? new Date(result[0].latestTime) : null;

			// Convert latestTime to epoch if it's not null
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors, totals }, latestEpoch);
		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getGhgMitigationForRecentYear() {

		// Get the current year
		const currentYear = new Date().getFullYear();

		// Calculate the previous year
		const previousYear = currentYear - 1;

		try {
			const query = `
				SELECT 
						activity.sector,
						SUM((activity."mitigationTimeline"->'actual'->'actualEmissionReduct'->>(${previousYear} - (activity."mitigationTimeline" ->> 'startYear')::int))::numeric) AS total,
						Max(activity."updatedTime") as "latestTime"
					FROM 
						activity
					WHERE activity.sector IS NOT NULL
						AND activity."mitigationTimeline" IS NOT NULL
						AND (activity."mitigationTimeline" ->> 'startYear')::numeric <= ${previousYear}
					GROUP BY 
						activity.sector
					HAVING 
    				SUM((activity."mitigationTimeline" -> 'actual' -> 'actualEmissionReduct' ->> (${previousYear} - (activity."mitigationTimeline" ->> 'startYear')::int))::numeric) != 0
					ORDER BY 
						"latestTime" DESC;
			`;

			const result = await this.entityManager.query(query);
			const sectors = result.map(row => row.sector);
			const totals = result.map(row => row.total);

			// Get the latest time from the first row if result is not empty
			const latestTime = result.length ? new Date(result[0].latestTime) : null;

			// Convert latestTime to epoch if it's not null
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors, totals }, latestEpoch);
		} catch (err) {
			console.log(err);
			throw new HttpException(
				this.helperService.formatReqMessagesString(
					"common.unableToGetStats",
					[]
				),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	// New methods for CBT-related pie charts with typeOfSupport filter

	async getSupportByTypeChart(typeOfSupport?: CBTTypeOfSupport): Promise<DataCountResponseDto> {
		try {
			// Chart 7: Distribution by Type of Support (from CBTEntity)
			let query = `
				SELECT 
					c."typeOfSupport" as type,
					COUNT(DISTINCT c.id) as count,
					MAX(c."updatedTime") as "latestTime"
				FROM cbt c
				WHERE c."typeOfSupport" IS NOT NULL
			`;

			if (typeOfSupport) {
				query += ` AND c."typeOfSupport" = '${typeOfSupport}'`;
			}

			query += `
				GROUP BY c."typeOfSupport"
				ORDER BY MAX(c."updatedTime") DESC
			`;

			const result = await this.entityManager.query(query);

			const types = result.map(row => row.type);
			const counts = result.map(row => parseInt(row.count, 10));
			const latestTime = result.length ? new Date(result[0].latestTime) : null;
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors: types, counts }, latestEpoch);
		} catch (err) {
			console.log('getSupportByTypeChart error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getSupportByActivityStatusChart(typeOfSupport?: CBTTypeOfSupport): Promise<DataCountResponseDto> {
		try {
			// Chart 8: Distribution by Activity Status (Planned / Ongoing / Completed)
			let query = `
				SELECT 
					c.status,
					COUNT(DISTINCT c.id) as count,
					MAX(c."updatedTime") as "latestTime"
				FROM cbt c
				WHERE c.status IS NOT NULL
			`;

			if (typeOfSupport) {
				query += ` AND c."typeOfSupport" = '${typeOfSupport}'`;
			}

			query += `
				GROUP BY c.status
				ORDER BY MAX(c."updatedTime") DESC
			`;

			const result = await this.entityManager.query(query);

			const statuses = result.map(row => row.status);
			const counts = result.map(row => parseInt(row.count, 10));
			const latestTime = result.length ? new Date(result[0].latestTime) : null;
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors: statuses, counts }, latestEpoch);
		} catch (err) {
			console.log('getSupportByActivityStatusChart error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getSupportByETFSectorChart(typeOfSupport?: CBTTypeOfSupport): Promise<DataCountResponseDto> {
		try {
			// Chart 9: Distribution by ETF Sector (Energy, Transport, Industry, Agriculture)
			let query = `
				SELECT 
					c.sector,
					COUNT(DISTINCT c.id) as count,
					MAX(c."updatedTime") as "latestTime"
				FROM cbt c
				WHERE c.sector IS NOT NULL
				AND c.sector IN ('Energy', 'Transport', 'Industry (IPPU)', 'Agriculture')
			`;

			if (typeOfSupport) {
				query += ` AND c."typeOfSupport" = '${typeOfSupport}'`;
			}

			query += `
				GROUP BY c.sector
				ORDER BY MAX(c."updatedTime") DESC
			`;

			const result = await this.entityManager.query(query);

			const sectors = result.map(row => row.sector);
			const counts = result.map(row => parseInt(row.count, 10));
			const latestTime = result.length ? new Date(result[0].latestTime) : null;
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors, counts }, latestEpoch);
		} catch (err) {
			console.log('getSupportByETFSectorChart error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getSupportByFinancialInstrumentChart(typeOfSupport?: CBTTypeOfSupport): Promise<DataCountResponseDto> {
		try {
			// Chart 10: Distribution by Financial Instrument (from CBTFundingEntity)
			let query = `
				SELECT 
					f."financialInstrument" as instrument,
					COUNT(DISTINCT f.id) as count,
					MAX(f."updatedTime") as "latestTime"
				FROM cbt_funding f
				JOIN cbt c ON f."projectId" = c.id
				WHERE f."financialInstrument" IS NOT NULL
			`;

			if (typeOfSupport) {
				query += ` AND c."typeOfSupport" = '${typeOfSupport}'`;
			}

			query += `
				GROUP BY f."financialInstrument"
				ORDER BY MAX(f."updatedTime") DESC
			`;

			const result = await this.entityManager.query(query);

			const instruments = result.map(row => row.instrument);
			const counts = result.map(row => parseInt(row.count, 10));
			const latestTime = result.length ? new Date(result[0].latestTime) : null;
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors: instruments, counts }, latestEpoch);
		} catch (err) {
			console.log('getSupportByFinancialInstrumentChart error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getSupportByFinancingChannelChart(typeOfSupport?: CBTTypeOfSupport): Promise<DataCountResponseDto> {
		try {
			// Chart 11: Distribution by Financing Channel/Multilateralni (from CBTFundingEntity)
			let query = `
				SELECT 
					f."fundingMethod" as channel,
					COUNT(DISTINCT f.id) as count,
					MAX(f."updatedTime") as "latestTime"
				FROM cbt_funding f
				JOIN cbt c ON f."projectId" = c.id
				WHERE f."fundingMethod" IS NOT NULL
			`;

			if (typeOfSupport) {
				query += ` AND c."typeOfSupport" = '${typeOfSupport}'`;
			}

			query += `
				GROUP BY f."fundingMethod"
				ORDER BY MAX(f."updatedTime") DESC
			`;

			const result = await this.entityManager.query(query);

			const channels = result.map(row => row.channel);
			const counts = result.map(row => parseInt(row.count, 10));
			const latestTime = result.length ? new Date(result[0].latestTime) : null;
			const latestEpoch = latestTime ? Math.floor(latestTime.getTime() / 1000) : 0;

			return new DataCountResponseDto({ sectors: channels, counts }, latestEpoch);
		} catch (err) {
			console.log('getSupportByFinancingChannelChart error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	// Batch method to fetch all 5 support charts in parallel
	async getAllSupportCharts(typeOfSupport?: CBTTypeOfSupport): Promise<{
		supportByType: DataCountResponseDto;
		supportByActivityStatus: DataCountResponseDto;
		supportByETFSector: DataCountResponseDto;
		supportByFinancialInstrument: DataCountResponseDto;
		supportByFinancingChannel: DataCountResponseDto;
	}> {
		try {
			// Execute all 5 queries in parallel
			const [
				supportByType,
				supportByActivityStatus,
				supportByETFSector,
				supportByFinancialInstrument,
				supportByFinancingChannel,
			] = await Promise.all([
				this.getSupportByTypeChart(typeOfSupport),
				this.getSupportByActivityStatusChart(typeOfSupport),
				this.getSupportByETFSectorChart(typeOfSupport),
				this.getSupportByFinancialInstrumentChart(typeOfSupport),
				this.getSupportByFinancingChannelChart(typeOfSupport),
			]);

			return {
				supportByType,
				supportByActivityStatus,
				supportByETFSector,
				supportByFinancialInstrument,
				supportByFinancingChannel,
			};
		} catch (err) {
			console.log('getAllSupportCharts error:', err);
			throw new HttpException(
				this.helperService.formatReqMessagesString("common.unableToGetStats", []),
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

}
