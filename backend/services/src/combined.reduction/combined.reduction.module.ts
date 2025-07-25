import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { UtilModule } from 'src/util/util.module';
import { UserModule } from 'src/user/user.module';
import { AsyncOperationsModule } from 'src/async-operations/async-operations.module';
import { CombinedGhgReductionViewEntity } from 'src/entities/combined.ghgReduction.view.entity';
import { GhgCombinedReductionService } from './combined.reduction.service';

@Module({
    imports: [
    TypeOrmModule.forFeature([CombinedGhgReductionViewEntity]),
    CaslModule,
    UtilModule,
    forwardRef(() => UserModule),
    AsyncOperationsModule,
  ],
  providers: [Logger, GhgCombinedReductionService],
  exports: [GhgCombinedReductionService]
})
export class GhgCombinedReductionModule {}
