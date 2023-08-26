import { Controller, Get } from '@nestjs/common';
import { GasPriceService } from './gas-price.service';

@Controller('gas-price')
export class GasPriceController {
  constructor(private readonly gasPriceService: GasPriceService) {}

  @Get('/')
  async getGasPrice() {
    console.log('GasPriceController.getGasPrice()');
    return this.gasPriceService.getGasPrice();
  }
}
