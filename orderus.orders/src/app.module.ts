import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DaprModule } from './dapr/dapr.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './modules/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource, dataSourceOptions } from './db/data-soucre';
import { ItemsModule } from './modules/items/items.module';

@Module({
  imports: [
    OrdersModule,
    CommonModule, 
    DaprModule,
  
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOptions,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return dataSource;
      },
    }),
  
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
