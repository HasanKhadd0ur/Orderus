import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getById(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id, isDeleted: false } });
    if (!orderItem) throw new NotFoundException(`OrderItem with id ${id} not found`);
    return orderItem;
  }

  async softDelete(id: string) {
    const orderItem = await this.getById(id);
    orderItem.isDeleted = true;
    return this.orderItemRepository.save(orderItem);
  }

  async updateQuantity(id: string, quantity: number) {
    const orderItem = await this.getById(id);
    orderItem.quantity = quantity;
    return this.orderItemRepository.save(orderItem);
  }
}
