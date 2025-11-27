import { Injectable, Logger } from '@nestjs/common';
import { DaprClient, CommunicationProtocolEnum } from '@dapr/dapr';
import * as dotenv from 'dotenv';

dotenv.config();
const daprPort = process.env.DAPR_HTTP_PORT || '3500';

@Injectable()
export class DaprClientService {
  private readonly logger = new Logger(DaprClientService.name);
  private client: DaprClient;

  constructor() {
    this.client = new DaprClient({
      daprPort: daprPort,
      communicationProtocol: CommunicationProtocolEnum.HTTP,
    });
  }
  get clientInstance() {
    return this.client;
  }
  
  async publishOrderCreated(order: any) {
    try {
      await this.client.pubsub.publish('order-pubsub', 'orders.created', order);
      this.logger.log(`OrderCreated event published`, order);
    } catch (err) {
      this.logger.error('Failed to publish event', err);
    }
  }
}
