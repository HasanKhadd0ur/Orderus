import { Module } from '@nestjs/common';
import { DaprClientService } from './services/dapr-client/dapr-client.service';

@Module({
  providers: [DaprClientService],
  exports: [DaprClientService],
})
export class DaprModule {}
