import { Test, TestingModule } from '@nestjs/testing';
import { RelayerController } from './relayer.controller';
import { RelayerService } from './relayer.service';

describe('GasPriceController', () => {
  let controller: RelayerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RelayerController],
      providers: [RelayerService],
    }).compile();

    controller = app.get<RelayerController>(RelayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
