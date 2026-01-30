import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTFinanceReceivedDto, CBTFinanceReceivedUpdateDto } from "../dtos/cbtFinanceReceived.dto";
import { CBTFinanceReceivedEntity } from "../entities/cbtFinanceReceived.entity";
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
export class CBTFinanceReceivedService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTFinanceReceivedEntity) private repo: Repository<CBTFinanceReceivedEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  async create(dto: CBTFinanceReceivedDto, user: User) {
    const entity: CBTFinanceReceivedEntity = plainToClass(CBTFinanceReceivedEntity, dto);

    entity.id = "CBTFR" + (await this.counterService.incrementCount(CounterType.CBT_FINANCE_RECEIVED, 5));
    entity.createdBy = user.id;
    entity.createdTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFinanceReceivedEntity>(entity);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceReceived.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtFinanceReceived.createSuccess", []),
      saved,
    );
  }

  async query(query: QueryDto, abilityCondition: string): Promise<DataListResponseDto> {
    const queryBuilder = this.repo
      .createQueryBuilder("cbtFinanceReceived")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable('"cbtFinanceReceived"', abilityCondition),
          '"cbtFinanceReceived"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtFinanceReceived"."${query?.sort?.key}"` : `"cbtFinanceReceived"."id"`,
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
        this.helperService.formatReqMessagesString("cbtFinanceReceived.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }

  async update(dto: CBTFinanceReceivedUpdateDto, user: User) {
    const current = await this.repo.findOne({ where: { id: dto.id } });

    if (!current) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFinanceReceived.notFound", [dto.id]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated: CBTFinanceReceivedEntity = plainToClass(CBTFinanceReceivedEntity, dto);
    updated.createdBy = current.createdBy;
    updated.createdTime = current.createdTime;
    updated.updatedBy = user.id;
    updated.updatedTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFinanceReceivedEntity>(updated);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceReceived.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFinanceReceived.updateSuccess", []),
      saved,
    );
  }

  async delete(deleteDto: DeleteDto, user: User) {
    const entity = await this.repo.findOne({ where: { id: deleteDto.entityId } });

    if (!entity) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFinanceReceived.notFound", [deleteDto.entityId]),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTFinanceReceivedEntity>(CBTFinanceReceivedEntity, entity.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceReceived.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFinanceReceived.deleteSuccess", []),
      null,
    );
  }
}
