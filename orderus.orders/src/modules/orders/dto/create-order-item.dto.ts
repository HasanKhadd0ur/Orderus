import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
