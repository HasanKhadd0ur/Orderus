import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;
  
  @Column()
  quantity: number;
  
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToMany(() => OrderItem, (orderItem) => orderItem.item)
  orderItems: OrderItem[];
}
