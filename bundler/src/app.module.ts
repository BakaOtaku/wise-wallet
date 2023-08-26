import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GasPriceController } from './gas-price/gas-price.controller';
import { GasPriceService } from './gas-price/gas-price.service';
import { RelayerController } from './relayer/relayer.controller';
import { RelayerService } from './relayer/relayer.service';

@Module({
  imports: [],
  controllers: [AppController, GasPriceController, RelayerController],
  providers: [AppService, GasPriceService, RelayerService],
})
export class AppModule {}
