import { Controller, Get, Post } from '@nestjs/common';
import { RelayerService } from './relayer.service';

@Controller('relay')
export class RelayerController {
  constructor(private readonly relayerService: RelayerService) {}

  @Get('/')
  async getStatus() {
    return this.relayerService.relay();
  }

  @Post('/')
  async relay() {
    return this.relayerService.relay();
  }
}
