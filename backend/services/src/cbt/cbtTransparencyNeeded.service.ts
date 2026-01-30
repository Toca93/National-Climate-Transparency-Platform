import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTTransparencyNeededDto, CBTTransparencyNeededUpdateDto } from "../dtos/cbtTransparency.dto";
import { CBTTransparencyNeededEntity } from "../entities/cbtTransparencyNeeded.entity";
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
export class CBTTransparencyNeededService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTTransparencyNeededEntity) private repo: Repository<CBTTransparencyNeededEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  async create(dto: CBTTransparencyNeededDto, user: User) {
    const entity: CBTTransparencyNeededEntity = plainToClass(CBTTransparencyNeededEntity, dto);

    entity.id = "CBTTN" + (await this.counterService.incrementCount(CounterType.CBT_TRANSPARENCY_NEEDED, 5));
    entity.createdBy = user.id;
    entity.createdTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTTransparencyNeededEntity>(entity);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyNeeded.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtTransparencyNeeded.createSuccess", []),
      saved,
    );
  }

  async query(query: QueryDto, abilityCondition: string): Promise<DataListResponseDto> {
    const queryBuilder = this.repo
      .createQueryBuilder("cbtTransparencyNeeded")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable('"cbtTransparencyNeeded"', abilityCondition),
          '"cbtTransparencyNeeded"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtTransparencyNeeded"."${query?.sort?.key}"` : `"cbtTransparencyNeeded"."id"`,
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
        this.helperService.formatReqMessagesString("cbtTransparencyNeeded.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return entity;
  }

  async update(dto: CBTTransparencyNeededUpdateDto, user: User) {
    const current = await this.repo.findOne({ where: { id: dto.id } });

    if (!current) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtTransparencyNeeded.notFound", [dto.id]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated: CBTTransparencyNeededEntity = plainToClass(CBTTransparencyNeededEntity, dto);
    updated.createdBy = current.createdBy;
    updated.createdTime = current.createdTime;
    updated.updatedBy = user.id;
    updated.updatedTime = Date.now();

    const saved = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTTransparencyNeededEntity>(updated);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyNeeded.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtTransparencyNeeded.updateSuccess", []),
      saved,
    );
  }

  async delete(deleteDto: DeleteDto, user: User) {
    const entity = await this.repo.findOne({ where: { id: deleteDto.entityId } });

    if (!entity) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtTransparencyNeeded.notFound", [deleteDto.entityId]),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTTransparencyNeededEntity>(CBTTransparencyNeededEntity, entity.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtTransparencyNeeded.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtTransparencyNeeded.deleteSuccess", []),
      null,
    );
  }
}
