import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTTransparencyReceivedDto, CBTTransparencyReceivedUpdateDto } from "../dtos/cbtTransparency.dto";
import { CBTTransparencyReceivedEntity } from "../entities/cbtTransparencyReceived.entity";
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
export class CBTTransparencyReceivedService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTTransparencyReceivedEntity) private repo: Repository<CBTTransparencyReceivedEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  async create(dto: CBTTransparencyReceivedDto, user: User) {
    const entity: CBTTransparencyReceivedEntity = plainToClass(CBTTransparencyReceivedEntity, dto);

    entity.id = "CBTTR" + (await this.counterService.incrementCount(CounterType.CBT_TRANSPARENCY_RECEIVED, 5));
    entity.createdBy = user.id;
    entity.createdTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTTransparencyReceivedEntity>(entity);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyReceived.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtTransparencyReceived.createSuccess", []),
      saved,
    );
  }

  async query(query: QueryDto, abilityCondition: string): Promise<DataListResponseDto> {
    const queryBuilder = this.repo
      .createQueryBuilder("cbtTransparencyReceived")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable('"cbtTransparencyReceived"', abilityCondition),
          '"cbtTransparencyReceived"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtTransparencyReceived"."${query?.sort?.key}"` : `"cbtTransparencyReceived"."id"`,
        query?.sort?.order ? query?.sort?.order : "DESC",
      );

    if (query.size && query.page) {
      queryBuilder.offset(query.size * query.page - query.size).limit(query.size);
    }

    const resp = await queryBuilder.getManyAndCount();

    return new DataListResponseDto(
      resp.length > 0 ? resp[0] : [],
      resp.length > 1 ? resp[1] : 0,
    );
  }

  async getById(id: string) {
    const entity = await this.repo.findOne({ where: { id } });

    if (!entity) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtTransparencyReceived.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }

  async update(dto: CBTTransparencyReceivedUpdateDto, user: User) {
    const current = await this.repo.findOne({ where: { id: dto.id } });

    if (!current) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtTransparencyReceived.notFound", [dto.id]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated: CBTTransparencyReceivedEntity = plainToClass(CBTTransparencyReceivedEntity, dto);
    updated.createdBy = current.createdBy;
    updated.createdTime = current.createdTime;
    updated.updatedBy = user.id;
    updated.updatedTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTTransparencyReceivedEntity>(updated);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyReceived.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtTransparencyReceived.updateSuccess", []),
      saved,
    );
  }

  async delete(deleteDto: DeleteDto, user: User) {
    const entity = await this.repo.findOne({ where: { id: deleteDto.entityId } });

    if (!entity) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtTransparencyReceived.notFound", [deleteDto.entityId]),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTTransparencyReceivedEntity>(CBTTransparencyReceivedEntity, entity.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyReceived.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtTransparencyReceived.deleteSuccess", []),
      null,
    );
  }
}
