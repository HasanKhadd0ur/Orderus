import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  // Create new item
  async createItem(dto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create(dto);
    return this.itemRepository.save(item);
  }

  // Update existing item
  async updateItem(id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.getItemById(id);
    Object.assign(item, dto);
    return this.itemRepository.save(item);
  }

  // Get all items (not deleted)
  async getAllItems(): Promise<Item[]> {
    return this.itemRepository.find({ where: { isDeleted: false } });
  }

  // Get item by id
  async getItemById(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id, isDeleted: false } });
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return item;
  }

  // Soft delete
  async softDelete(id: string) {
    const item = await this.getItemById(id);
    item.isDeleted = true;
    return this.itemRepository.save(item);
  }

  // Additional use cases

  // Search items by name
  async searchByName(name: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { name: ILike(`%${name}%`), isDeleted: false },
    });
  }

  // Restock an item
  async restockItem(id: string, quantity: number): Promise<Item> {
    const item = await this.getItemById(id);
    item.quantity += quantity;
    return this.itemRepository.save(item);
  }

  // Update price
  async updatePrice(id: string, price: number): Promise<Item> {
    const item = await this.getItemById(id);
    item.price = price;
    return this.itemRepository.save(item);
  }
}
