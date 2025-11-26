import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { DaprModule } from './dapr/dapr.module';
import { CommonModule } from './common/common.module';
import { OrdersResolver } from './modules/orders/orders.resolver';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [OrdersModule, CommonModule, DaprModule],
  controllers: [AppController],
  providers: [AppService, OrdersResolver],
})
export class AppModule {}
