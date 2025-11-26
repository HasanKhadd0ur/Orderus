import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderItemsService } from './services/order-items.service';
import { ItemsModule } from '../items/items.module';
import { DaprModule } from 'src/dapr/dapr.module';

@Module({
  imports: [
    ItemsModule,
    DaprModule,
    TypeOrmModule.forFeature([
      OrderItem,
      Order])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderItemsService],
})
export class OrdersModule {}
