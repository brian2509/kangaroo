import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StickersModule } from "../stickers/stickers.module";
import { StickerPack } from "./entities/sticker-pack.entity";
import { StickerPacksController } from "./sticker-packs.controller";
import { StickerPacksService } from "./sticker-packs.service";

@Module({
  imports: [TypeOrmModule.forFeature([StickerPack]), StickersModule],
  controllers: [StickerPacksController],
  providers: [StickerPacksService],
})
export class StickerPacksModule {}
