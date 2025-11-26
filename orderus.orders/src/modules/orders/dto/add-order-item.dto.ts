import { IsUUID, IsInt, Min } from 'class-validator';

export class AddOrderItemDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
