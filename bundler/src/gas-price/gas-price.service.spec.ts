import { Test, TestingModule } from '@nestjs/testing';
import { GasPriceService } from './gas-price.service';
import { CONST, rpc, u } from '@cityofzion/neon-core';

describe('GasPriceService', () => {
  let service: GasPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GasPriceService],
    }).compile();

    service = module.get<GasPriceService>(GasPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
