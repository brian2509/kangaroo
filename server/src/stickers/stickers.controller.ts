import {Body, Controller, Delete, Get, Param, Post, Put,} from "@nestjs/common";
import {CreateStickerDto} from "./dto/create-sticker.dto";
import {UpdateStickerDto} from "./dto/update-sticker.dto";
import {StickersService} from "./stickers.service";

@Controller("stickers")
export class StickersController {
  constructor(private readonly stickersService: StickersService) {
  }

  @Post()
  create(@Body() createStickerDto: CreateStickerDto) {
    return this.stickersService.create(createStickerDto);
  }

  @Get()
  findAll() {
    return this.stickersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.stickersService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateStickerDto: UpdateStickerDto) {
    return this.stickersService.update(id, updateStickerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.stickersService.remove(id);
  }
}
