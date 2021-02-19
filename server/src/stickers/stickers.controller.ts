import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateStickerDto } from "./dto/create-sticker.dto";
import { StickerRo } from "./dto/response-sticker.dto";
import { UpdateStickerDto } from "./dto/update-sticker.dto";
import { StickersService } from "./stickers.service";

@ApiTags("sticker")
@Controller("stickers")
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @Post()
  create(@Body() createStickerDto: CreateStickerDto): Promise<StickerRo> {
    return this.stickersService.create(createStickerDto);
  }

  @Get()
  findAll(): Promise<StickerRo[]> {
    return this.stickersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<StickerRo> {
    return this.stickersService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateStickerDto: UpdateStickerDto
  ): Promise<StickerRo> {
    return this.stickersService.update(id, updateStickerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<StickerRo> {
    return this.stickersService.remove(id);
  }
}
