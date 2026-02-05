import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTMacroDto, CBTMacroUpdateDto } from "../dtos/cbt.macro.dto";
import { CBTMacroEntity } from "../entities/cbt.macro.entity";
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
export class CBTMacroService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTMacroEntity) private cbtMacroRepo: Repository<CBTMacroEntity>,
    @InjectRepository(CBTEntity) private cbtRepo: Repository<CBTEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
  ) {}

  // Create CBT Macro Record
  async createCBTMacro(cbtMacroDto: CBTMacroDto, user: User) {
    // Verify that the referenced CBT project exists
    const cbt = await this.cbtRepo.findOne({
      where: { id: cbtMacroDto.projectId },
    });

    if (!cbt) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtMacro.cbtNotFound", [
          cbtMacroDto.projectId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const cbtMacro: CBTMacroEntity = plainToClass(CBTMacroEntity, cbtMacroDto);

    cbtMacro.id =
      "CBTM" + (await this.counterService.incrementCount(CounterType.CBT, 5));

    const savedCBTMacro = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTMacroEntity>(cbtMacro);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtMacro.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbtMacro.createSuccess", []),
      savedCBTMacro,
    );
  }

  // Query CBT Macro Records
  async query(
    query: QueryDto,
    abilityCondition: string,
  ): Promise<DataListResponseDto> {
    const queryBuilder = this.cbtMacroRepo
      .createQueryBuilder("cbtMacro")
      .leftJoinAndSelect("cbtMacro.cbt", "cbt")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable(
            '"cbtMacro"',
            abilityCondition,
          ),
          '"cbtMacro"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbtMacro"."${query?.sort?.key}"` : `"cbtMacro"."id"`,
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

  // Get CBT Macro by ID
  async getCBTMacroById(id: string) {
    const cbtMacro = await this.cbtMacroRepo.findOne({
      where: { id },
      relations: ["cbt"],
    });

    if (!cbtMacro) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtMacro.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return cbtMacro;
  }

  // Update CBT Macro Record
  async updateCBTMacro(cbtMacroUpdateDto: CBTMacroUpdateDto, user: User) {
    const currentCBTMacro = await this.cbtMacroRepo.findOne({
      where: { id: cbtMacroUpdateDto.id },
    });

    if (!currentCBTMacro) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtMacro.notFound", [
          cbtMacroUpdateDto.id,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    // If projectId is being updated, verify the new CBT exists
    if (cbtMacroUpdateDto.projectId && cbtMacroUpdateDto.projectId !== currentCBTMacro.projectId) {
      const cbt = await this.cbtRepo.findOne({
        where: { id: cbtMacroUpdateDto.projectId },
      });

      if (!cbt) {
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtMacro.cbtNotFound", [
            cbtMacroUpdateDto.projectId,
          ]),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const cbtMacroUpdate: CBTMacroEntity = plainToClass(CBTMacroEntity, cbtMacroUpdateDto);

    // Preserve fields that shouldn't change
    cbtMacroUpdate.createdTime = currentCBTMacro.createdTime;

    const updatedCBTMacro = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTMacroEntity>(cbtMacroUpdate);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtMacro.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtMacro.updateSuccess", []),
      updatedCBTMacro,
    );
  }

  // Delete CBT Macro Record
  async deleteCBTMacro(deleteDto: DeleteDto, user: User) {
    const cbtMacro = await this.cbtMacroRepo.findOne({
      where: { id: deleteDto.entityId },
    });

    if (!cbtMacro) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbtMacro.notFound", [
          deleteDto.entityId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTMacroEntity>(CBTMacroEntity, cbtMacro.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbtMacro.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbtMacro.deleteSuccess", []),
      null,
    );
  }
}
