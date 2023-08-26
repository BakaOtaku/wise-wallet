import { Test, TestingModule } from '@nestjs/testing';
import { RelayerService } from './relayer.service';

describe('RelayerService', () => {
  let service: RelayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelayerService],
    }).compile();

    service = module.get<RelayerService>(RelayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
