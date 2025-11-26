import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { DaprModule } from './dapr/dapr.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [CommonModule, DaprModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
