import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TOPICS } from 'src/common/constants/topics';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
 
  @Post('orders-create')
  async handleOrderCreated(@Body() payload: any) {
    console.log('Received order created event:', payload);

    // Dummy email sending
    console.log(`Sending "Thank you" email to user: ${payload.customerName} (ID: ${payload.userId})`);

    return { message: 'Notification processed successfully' };
  }
}
