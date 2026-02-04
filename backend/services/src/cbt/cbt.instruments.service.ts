import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTInstrumentsDto, CBTInstrumentsUpdateDto } from "../dtos/cbt.instruments.dto";
import { CBTInstrumentsEntity } from "../entities/cbt.instruments.entity";
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
export class CBTInstrumentsService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTInstrumentsEntity) private cbtInstrumentsRepo: Repository<CBTInstrumentsEntity>,
    @InjectRepository(CBTEntity) private cbtRepo: Repository<CBTEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  // Create CBT Instruments Record
  async createCBTInstruments(cbtInstrumentsDto: CBTInstrumentsDto, user: User) {
    // Verify that the referenced CBT project exists
    const cbt = await this.cbtRepo.findOne({
      where: { id: cbtInstrumentsDto.projectId },
    });

    if (!cbt) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtInstruments.cbtNotFound", [
          cbtInstrumentsDto.projectId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const cbtInstruments: CBTInstrumentsEntity = plainToClass(CBTInstrumentsEntity, cbtInstrumentsDto);

    cbtInstruments.id =
      "CBTI" + (await this.counterService.incrementCount(CounterType.CBT, 5));

    const savedCBTInstruments = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTInstrumentsEntity>(cbtInstruments);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtInstruments.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtInstruments.createSuccess", []),
      savedCBTInstruments,
    );
  }

  // Query CBT Instruments Records
  async query(
    query: QueryDto,
    abilityCondition: string,
  ): Promise<DataListResponseDto> {
    const queryBuilder = this.cbtInstrumentsRepo
      .createQueryBuilder("cbtInstruments")
      .leftJoinAndSelect("cbtInstruments.cbt", "cbt")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable(
            '"cbtInstruments"',
            abilityCondition,
          ),
          '"cbtInstruments"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtInstruments"."${query?.sort?.key}"` : `"cbtInstruments"."id"`,
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

  // Get CBT Instruments by ID
  async getCBTInstrumentsById(id: string) {
    const cbtInstruments = await this.cbtInstrumentsRepo.findOne({
      where: { id },
      relations: ["cbt"],
    });

    if (!cbtInstruments) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtInstruments.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return cbtInstruments;
  }

  // Update CBT Instruments Record
  async updateCBTInstruments(cbtInstrumentsUpdateDto: CBTInstrumentsUpdateDto, user: User) {
    const currentCBTInstruments = await this.cbtInstrumentsRepo.findOne({
      where: { id: cbtInstrumentsUpdateDto.id },
    });

    if (!currentCBTInstruments) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtInstruments.notFound", [
          cbtInstrumentsUpdateDto.id,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    // If projectId is being updated, verify the new CBT exists
    if (cbtInstrumentsUpdateDto.projectId && cbtInstrumentsUpdateDto.projectId !== currentCBTInstruments.projectId) {
      const cbt = await this.cbtRepo.findOne({
        where: { id: cbtInstrumentsUpdateDto.projectId },
      });

      if (!cbt) {
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtInstruments.cbtNotFound", [
            cbtInstrumentsUpdateDto.projectId,
          ]),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const cbtInstrumentsUpdate: CBTInstrumentsEntity = plainToClass(CBTInstrumentsEntity, cbtInstrumentsUpdateDto);

    // Preserve fields that shouldn't change
    cbtInstrumentsUpdate.createdTime = currentCBTInstruments.createdTime;

    const updatedCBTInstruments = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTInstrumentsEntity>(cbtInstrumentsUpdate);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtInstruments.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtInstruments.updateSuccess", []),
      updatedCBTInstruments,
    );
  }

  // Delete CBT Instruments Record
  async deleteCBTInstruments(deleteDto: DeleteDto, user: User) {
    const cbtInstruments = await this.cbtInstrumentsRepo.findOne({
      where: { id: deleteDto.entityId },
    });

    if (!cbtInstruments) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtInstruments.notFound", [
          deleteDto.entityId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTInstrumentsEntity>(CBTInstrumentsEntity, cbtInstruments.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtInstruments.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtInstruments.deleteSuccess", []),
      null,
    );
  }
}
