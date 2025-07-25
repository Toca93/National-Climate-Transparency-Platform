import { Test, TestingModule } from '@nestjs/testing';
import { GhgCombinedReductionService } from './combined.reduction.service';

describe('GhgCombinedReductionService', () => {
  let service: GhgCombinedReductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GhgCombinedReductionService],
    }).compile();

    service = module.get<GhgCombinedReductionService>(GhgCombinedReductionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
