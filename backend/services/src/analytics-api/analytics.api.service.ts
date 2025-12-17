import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DataCountResponseDto } from "../dtos/data.count.response";
import { ActionEntity } from "../entities/action.entity";
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { ProjectEntity } from "../entities/project.entity";
import { ActivityEntity } from "../entities/activity.entity";
import { SupportDirection } from "../enums/support.enum";
import { HelperService } from "../util/helpers.service";
import { ConfigurationSettingsService } from "../util/configurationSettings.service";
import { ConfigurationSettingsType } from "../enums/configuration.settings.type.enum";

@Injectable()
export class AnalyticsService {

	constructor(
		@InjectEntityManager() private entityManager: EntityManager,
		@InjectRepository(ActivityEntity) private activityRepo: Repository<ActivityEntity>,
		private helperService: HelperService,
		private configService: ConfigurationSettingsService
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
					'COUNT(DISTINCT CASE WHEN support.direction = :directionReceived THEN activity.activityId END) as "supportReceivedActivities"',
					'COUNT(DISTINCT CASE WHEN support.direction = :directionReceived OR support.direction = :directionNeeded THEN activity.activityId END) as "totalSupportedActivities"',
					'GREATEST(MAX(activity."updatedTime"), MAX(support."updatedTime")) as "latestTime"'
				])
				.setParameter('directionReceived', SupportDirection.RECEIVED)
				.setParameter('directionNeeded', SupportDirection.NEEDED)
				.getRawOne();

			const supportReceivedActivities = results.supportReceivedActivities ? parseInt(results.supportReceivedActivities) : 0;
			const totalSupportedActivities = results.totalSupportedActivities ? parseInt(results.totalSupportedActivities) : 0;
			const supportNeededActivities = totalSupportedActivities - supportReceivedActivities;

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

			return new DataCountResponseDto({ sectors, totals }, latestEpoch, year);
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
		let previousYear = currentYear - 1;

		try {
			const settings = await this.configService.getSetting(ConfigurationSettingsType.SECTOR_YEAR_CONFIGURATION);
			if (settings && settings.mostRecentYear) {
				previousYear = settings.mostRecentYear;
			}
		} catch (error) {
			console.log('Error fetching configuration settings, using default previous year:', error);
		}

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

			return new DataCountResponseDto({ sectors, totals }, latestEpoch, previousYear);
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

}
