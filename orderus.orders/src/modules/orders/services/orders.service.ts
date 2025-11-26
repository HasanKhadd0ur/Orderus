import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { ItemsService } from '../../items/services/items.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { AddOrderItemDto } from '../dto/add-order-item.dto';
import { OrderStatus } from '../entities/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly itemsService: ItemsService,
  ) {}

  // Create order with items
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      customerName: dto.customerName,
      status: OrderStatus.PENDING,
    });

    const orderItems: OrderItem[] = [];
    for (const i of dto.items) {
      const item = await this.itemsService.getItemById(i.itemId);
      const orderItem = this.orderItemRepository.create({
        item,
        quantity: i.quantity,
        order,
      });
      orderItems.push(orderItem);
    }

    order.items = orderItems;
    return this.orderRepository.save(order);
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ where: { isDeleted: false } });
  }

  // Get order by ID
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id, isDeleted: false } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }
  
  async addOrderItem(orderId: string, dto: AddOrderItemDto): Promise<Order> {
    const order = await this.getOrderById(orderId); // will throw if not found
    const item = await this.itemsService.getItemById(dto.itemId); // throws if not found

    const orderItem = this.orderItemRepository.create({
      order,
      item,
      quantity: dto.quantity,
    });

    order.items.push(orderItem); // add to order
    return this.orderRepository.save(order); // cascade saves the new OrderItem
  }


  // Update order status
  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  // Soft delete order
  async softDeleteOrder(id: string) {
    const order = await this.getOrderById(id);
    order.isDeleted = true;
    return this.orderRepository.save(order);
  }

  // Additional use case: calculate total price
  async calculateTotal(id: string): Promise<number> {
    const order = await this.getOrderById(id);
    return order.items.reduce((sum, oi) => sum + oi.item.price * oi.quantity, 0);
  }
}
