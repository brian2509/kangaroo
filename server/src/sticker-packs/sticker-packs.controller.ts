import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CreateStickerDto } from "../stickers/dto/create-sticker.dto";
import { StickerRo } from "../stickers/dto/response-sticker.dto";
import { UserRo } from "../users/dto/response-user.dto";
import { CreateStickerPackDto } from "./dto/create-sticker-pack.dto";
import { StickerPackRo } from "./dto/sticker-pack-ro.dto";
import { UpdateStickerPackDto } from "./dto/update-sticker-pack.dto";
import { StickerPacksService } from "./sticker-packs.service";

@ApiTags("auth")
@UseGuards(JwtAuthGuard)
@Controller("sticker-packs")
export class StickerPacksController {
  constructor(private readonly stickerPacksService: StickerPacksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createStickerPackDto: CreateStickerPackDto,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.create(createStickerPackDto, user.id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateStickerPackDto: UpdateStickerPackDto,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.update(id, updateStickerPackDto, user.id);
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.remove(id, user.id);
  }

  @UseInterceptors(FileInterceptor("file"))
  @Post(":id/stickers")
  async addSticker(
    @Param("id") id: string,
    @Body() createStickerDto: CreateStickerDto,
    @UploadedFile() file,
    @User() user: UserRo
  ): Promise<StickerRo> {
    return this.stickerPacksService.addSticker(
      id,
      createStickerDto,
      file,
      user.id
    );
  }

  @Delete(":id/stickers/:stickerId")
  async deleteSticker(
    @Param("id") id: string,
    @Param("stickerId") stickerId: string,
    @User() user: UserRo
  ): Promise<StickerRo> {
    return this.stickerPacksService.removeSticker(id, stickerId, user.id);
  }

  // TODO: Make this route.
  @Post(":id/stickers/actions/copySticker")
  copySticker(
    @Param("id") id: string,
    @Param("stickerId") stickerId: string,
    @User() user: UserRo
  ) {
    return this.stickerPacksService.findAll();
  }

  @Get()
  findAll(): Promise<StickerPackRo[]> {
    return this.stickerPacksService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.findOne(id, user.id);
  }
}
