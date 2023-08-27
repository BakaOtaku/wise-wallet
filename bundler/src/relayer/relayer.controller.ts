import { Body, Controller, Get, Post } from '@nestjs/common';
import { RelayerService } from './relayer.service';

export class BodyDto {
  signature: string;
}

@Controller('relay')
export class RelayerController {
  constructor(private readonly relayerService: RelayerService) {}

  @Get('/')
  async getStatus() {
    return this.relayerService.getStatus();
  }

  @Post('/')
  async relay(@Body() signatureDto: BodyDto) {
    return this.relayerService.relay(signatureDto.signature);
  }
}
