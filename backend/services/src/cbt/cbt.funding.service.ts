import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTFundingDto, CBTFundingUpdateDto } from "../dtos/cbt.funding.dto";
import { CBTFundingEntity } from "../entities/cbt.funding.entity";
import { CBTEntity } from "../entities/cbt.entity";
import { User } from "../entities/user.entity";
import { plainToClass } from "class-transformer";
import { CounterType } from "../enums/counter.type.enum";
import { CounterService } from "../util/counter.service";
import { HelperService } from "../util/helpers.service";
import { QueryDto } from "../dtos/query.dto";
import { DataListResponseDto } from "../dtos/data.list.response";
import { DataResponseMessageDto } from "../dtos/data.response.message";
import { DeleteDto } from "../dtos/delete.dto";

@Injectable()
export class CBTFundingService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTFundingEntity) private cbtFundingRepo: Repository<CBTFundingEntity>,
    @InjectRepository(CBTEntity) private cbtRepo: Repository<CBTEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  // Create CBT Funding Record
  async createCBTFunding(cbtFundingDto: CBTFundingDto, user: User) {
    // Verify that the referenced CBT project exists
    const cbt = await this.cbtRepo.findOne({
      where: { id: cbtFundingDto.projectId },
    });

    if (!cbt) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFunding.cbtNotFound", [
          cbtFundingDto.projectId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const cbtFunding: CBTFundingEntity = plainToClass(CBTFundingEntity, cbtFundingDto);

    cbtFunding.id =
      "CBTF" + (await this.counterService.incrementCount(CounterType.CBT, 5));

    const savedCBTFunding = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFundingEntity>(cbtFunding);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFunding.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtFunding.createSuccess", []),
      savedCBTFunding,
    );
  }

  // Query CBT Funding Records
  async query(
    query: QueryDto,
    abilityCondition: string,
  ): Promise<DataListResponseDto> {
    const queryBuilder = this.cbtFundingRepo
      .createQueryBuilder("cbtFunding")
      .leftJoinAndSelect("cbtFunding.cbt", "cbt")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable(
            '"cbtFunding"',
            abilityCondition,
          ),
          '"cbtFunding"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtFunding"."${query?.sort?.key}"` : `"cbtFunding"."id"`,
        query?.sort?.order ? query?.sort?.order : "DESC",
      );

    if (query.size && query.page) {
      queryBuilder
        .offset(query.size * query.page - query.size)
        .limit(query.size);
    }

    const resp = await queryBuilder.getManyAndCount();

    return new DataListResponseDto(
      resp.length > 0 ? resp[0] : [],
      resp.length > 1 ? resp[1] : 0,
    );
  }

  // Get CBT Funding by ID
  async getCBTFundingById(id: string) {
    const cbtFunding = await this.cbtFundingRepo.findOne({
      where: { id },
      relations: ["cbt"],
    });

    if (!cbtFunding) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFunding.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return cbtFunding;
  }

  // Update CBT Funding Record
  async updateCBTFunding(cbtFundingUpdateDto: CBTFundingUpdateDto, user: User) {
    const currentCBTFunding = await this.cbtFundingRepo.findOne({
      where: { id: cbtFundingUpdateDto.id },
    });

    if (!currentCBTFunding) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFunding.notFound", [
          cbtFundingUpdateDto.id,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    // If projectId is being updated, verify the new CBT exists
    if (cbtFundingUpdateDto.projectId && cbtFundingUpdateDto.projectId !== currentCBTFunding.projectId) {
      const cbt = await this.cbtRepo.findOne({
        where: { id: cbtFundingUpdateDto.projectId },
      });

      if (!cbt) {
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFunding.cbtNotFound", [
            cbtFundingUpdateDto.projectId,
          ]),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const cbtFundingUpdate: CBTFundingEntity = plainToClass(CBTFundingEntity, cbtFundingUpdateDto);

    // Preserve fields that shouldn't change
    cbtFundingUpdate.createdTime = currentCBTFunding.createdTime;

    const updatedCBTFunding = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFundingEntity>(cbtFundingUpdate);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFunding.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFunding.updateSuccess", []),
      updatedCBTFunding,
    );
  }

  // Delete CBT Funding Record
  async deleteCBTFunding(deleteDto: DeleteDto, user: User) {
    const cbtFunding = await this.cbtFundingRepo.findOne({
      where: { id: deleteDto.entityId },
    });

    if (!cbtFunding) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFunding.notFound", [
          deleteDto.entityId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTFundingEntity>(CBTFundingEntity, cbtFunding.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFunding.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFunding.deleteSuccess", []),
      null,
    );
  }
}
