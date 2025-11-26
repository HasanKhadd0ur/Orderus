import { BaseEntity } from 'src/common/entities/base.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Item, (item) => item.orderItems, { eager: true })
  item: Item;

  @Column('int')
  quantity: number;
}
