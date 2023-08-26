import { Module } from '@nestjs/common';
import { RelayerController } from './relayer.controller';
import { RelayerService } from './relayer.service';

@Module({
  imports: [],
  controllers: [RelayerController],
  providers: [RelayerService],
})
export class PublicModule {}
