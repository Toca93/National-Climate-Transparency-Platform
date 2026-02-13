import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CBTDto, CBTUpdateDto } from "../dtos/cbt.dto";
import { CBTEntity } from "../entities/cbt.entity";
import { User } from "../entities/user.entity";
import { plainToClass } from "class-transformer";
import { CounterType } from "../enums/counter.type.enum";
import { CounterService } from "../util/counter.service";
import { HelperService } from "../util/helpers.service";
import { FileUploadService } from "../util/fileUpload.service";
import { DocumentEntityDto } from "../dtos/document.entity.dto";
import { QueryDto } from "../dtos/query.dto";
import { DataListResponseDto } from "../dtos/data.list.response";
import { DataResponseMessageDto } from "../dtos/data.response.message";
import { DeleteDto } from "../dtos/delete.dto";

@Injectable()
export class CBTService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRepository(CBTEntity) private cbtRepo: Repository<CBTEntity>,
    private counterService: CounterService,
    private helperService: HelperService,
    private fileUploadService: FileUploadService,
  ) {}

  // Create CBT Record
  async createCBT(cbtDto: CBTDto, user: User) {
    const cbt: CBTEntity = plainToClass(CBTEntity, cbtDto);

    cbt.id =
      "CBT" + (await this.counterService.incrementCount(CounterType.CBT, 5));

    // Upload documents and create the doc array
    if (cbtDto.documents) {
      const documents = [];
      for (const documentItem of cbtDto.documents) {
        const response = await this.fileUploadService.uploadDocument(
          documentItem.data,
          documentItem.title,
          "cbt",
        );
        const docEntity = new DocumentEntityDto();
        docEntity.title = documentItem.title;
        docEntity.url = response;
        docEntity.createdTime = new Date().getTime();
        documents.push(docEntity);
      }
      cbt.documents = documents;
    }

    const savedCBT = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTEntity>(cbt);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbt.createFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.CREATED,
      this.helperService.formatReqMessagesString("cbt.createSuccess", []),
      savedCBT,
    );
  }

  // Query CBT Records
  async query(
    query: QueryDto,
    abilityCondition: string,
  ): Promise<DataListResponseDto> {
    const queryBuilder = this.cbtRepo
      .createQueryBuilder("cbt")
      .where(
        this.helperService.generateWhereSQL(
          query,
          this.helperService.parseMongoQueryToSQLWithTable(
            '"cbt"',
            abilityCondition,
          ),
          '"cbt"',
        ),
      )
      .orderBy(
        query?.sort?.key ? `"cbt"."${query?.sort?.key}"` : `"cbt"."id"`,
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

  // Get CBT by ID
  async getCBTById(id: string) {
    const cbt = await this.cbtRepo.findOne({ where: { id } });

    if (!cbt) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbt.notFound", [id]),
        HttpStatus.NOT_FOUND,
      );
    }

    return cbt;
  }

  // Update CBT Record
  async updateCBT(cbtUpdateDto: CBTUpdateDto, user: User) {
    const currentCBT = await this.cbtRepo.findOne({
      where: { id: cbtUpdateDto.id },
    });

    if (!currentCBT) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbt.notFound", [
          cbtUpdateDto.id,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const cbtUpdate: CBTEntity = plainToClass(CBTEntity, cbtUpdateDto);

    // Preserve fields that shouldn't change
    cbtUpdate.createdTime = currentCBT.createdTime;

    // Upload new documents
    if (cbtUpdateDto.newDocuments) {
      const newDocuments = [];
      for (const documentItem of cbtUpdateDto.newDocuments) {
        const response = await this.fileUploadService.uploadDocument(
          documentItem.data,
          documentItem.title,
          "cbt",
        );
        const docEntity = new DocumentEntityDto();
        docEntity.title = documentItem.title;
        docEntity.url = response;
        docEntity.createdTime = new Date().getTime();
        newDocuments.push(docEntity);
      }

      // Merge with existing documents
      cbtUpdate.documents = currentCBT.documents
        ? [...currentCBT.documents, ...newDocuments]
        : [...newDocuments];
    } else {
      cbtUpdate.documents = currentCBT.documents;
    }

    // Remove documents
    if (cbtUpdateDto.removedDocuments && cbtUpdateDto.removedDocuments.length > 0) {
      cbtUpdate.documents = cbtUpdate.documents
        ? cbtUpdate.documents.filter(
            (item: any) => !cbtUpdateDto.removedDocuments.some((url) => url === item.url),
          )
        : null;
      if (cbtUpdate.documents && cbtUpdate.documents.length === 0) {
        cbtUpdate.documents = null;
      }
    }

    const updatedCBT = await this.entityManager
      .transaction(async (em) => {
        return await em.save<CBTEntity>(cbtUpdate);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbt.updateFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbt.updateSuccess", []),
      updatedCBT,
    );
  }

  // Delete CBT Record
  async deleteCBT(deleteDto: DeleteDto, user: User) {
    const cbt = await this.cbtRepo.findOne({
      where: { id: deleteDto.entityId },
    });

    if (!cbt) {
      throw new HttpException(
        this.helperService.formatReqMessagesString("cbt.notFound", [
          deleteDto.entityId,
        ]),
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.entityManager
      .transaction(async (em) => {
        return await em.delete<CBTEntity>(CBTEntity, cbt.id);
      })
      .catch((err: any) => {
        console.log(err);
        throw new HttpException(
          this.helperService.formatReqMessagesString("cbt.deleteFailed", [err]),
          HttpStatus.BAD_REQUEST,
        );
      });

    return new DataResponseMessageDto(
      HttpStatus.OK,
      this.helperService.formatReqMessagesString("cbt.deleteSuccess", []),
      null,
    );
  }
}
