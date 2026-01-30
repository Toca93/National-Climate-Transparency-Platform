import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTFinanceNeededDto, CBTFinanceNeededUpdateDto } from "../dtos/cbtFinanceNeeded.dto";
import { CBTFinanceNeededEntity } from "../entities/cbtFinanceNeeded.entity";
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
export class CBTFinanceNeededService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTFinanceNeededEntity) private repo: Repository<CBTFinanceNeededEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  async create(dto: CBTFinanceNeededDto, user: User) {
    const entity: CBTFinanceNeededEntity = plainToClass(CBTFinanceNeededEntity, dto);

    entity.id = "CBTFN" + (await this.counterService.incrementCount(CounterType.CBT_FINANCE_NEEDED, 5));
    entity.createdBy = user.id;
    entity.createdTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFinanceNeededEntity>(entity);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceNeeded.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtFinanceNeeded.createSuccess", []),
      saved,
    );
  }

  async query(query: QueryDto, abilityCondition: string): Promise<DataListResponseDto> {
    const queryBuilder = this.repo
      .createQueryBuilder("cbtFinanceNeeded")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable('"cbtFinanceNeeded"', abilityCondition),
          '"cbtFinanceNeeded"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtFinanceNeeded"."${query?.sort?.key}"` : `"cbtFinanceNeeded"."id"`,
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
        this.helperService.formatReqMessagesString("cbtFinanceNeeded.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }

  async update(dto: CBTFinanceNeededUpdateDto, user: User) {
    const current = await this.repo.findOne({ where: { id: dto.id } });

    if (!current) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFinanceNeeded.notFound", [dto.id]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated: CBTFinanceNeededEntity = plainToClass(CBTFinanceNeededEntity, dto);
    updated.createdBy = current.createdBy;
    updated.createdTime = current.createdTime;
    updated.updatedBy = user.id;
    updated.updatedTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTFinanceNeededEntity>(updated);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceNeeded.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFinanceNeeded.updateSuccess", []),
      saved,
    );
  }

  async delete(deleteDto: DeleteDto, user: User) {
    const entity = await this.repo.findOne({ where: { id: deleteDto.entityId } });

    if (!entity) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtFinanceNeeded.notFound", [deleteDto.entityId]),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTFinanceNeededEntity>(CBTFinanceNeededEntity, entity.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtFinanceNeeded.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtFinanceNeeded.deleteSuccess", []),
      null,
    );
  }
}
