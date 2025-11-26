import { Controller, Post, Get, Param, Body, Delete, Patch, Query } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './services/items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.createItem(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.updateItem(id, dto);
  }

  @Get()
  findAll() {
    return this.itemsService.getAllItems();
  }

  @Get('search')
  search(@Query('name') name: string) {
    return this.itemsService.searchByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.getItemById(id);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.itemsService.softDelete(id);
  }

  @Patch(':id/restock')
  restock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.itemsService.restockItem(id, quantity);
  }

  @Patch(':id/price')
  updatePrice(@Param('id') id: string, @Body('price') price: number) {
    return this.itemsService.updatePrice(id, price);
  }
}
