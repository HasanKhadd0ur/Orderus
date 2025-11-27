import { Controller, Post, Get, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './services/orders.service';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { Action } from 'src/common/decorators/action.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Action('create_order') 
  @UseGuards(AuthorizationGuard)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.ordersService.softDeleteOrder(id);
  }

  @Get(':id/total')
  calculateTotal(@Param('id') id: string) {
    return this.ordersService.calculateTotal(id);
  }
   
  @Patch(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddOrderItemDto) {
    return this.ordersService.addOrderItem(id, dto);
  }
}
