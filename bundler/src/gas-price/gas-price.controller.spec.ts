import { Test, TestingModule } from '@nestjs/testing';
import { GasPriceController } from './gas-price.controller';
import { GasPriceService } from './gas-price.service';

describe('GasPriceController', () => {
  let controller: GasPriceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GasPriceController],
      providers: [GasPriceService],
    }).compile();

    controller = app.get<GasPriceController>(GasPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
