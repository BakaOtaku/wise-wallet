import { Module } from '@nestjs/common';
import { GasPriceController } from './gas-price.controller';
import { GasPriceService } from './gas-price.service';

@Module({
  imports: [],
  controllers: [GasPriceController],
  providers: [GasPriceService],
})
export class PublicModule {}
