import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StickersModule } from "../stickers/stickers.module";
import { StickerPackInvite } from "./entities/sticker-pack-invite.entity";
import { StickerPack } from "./entities/sticker-pack.entity";
import { InviteController } from "./invite.controller";
import { StickerPacksController } from "./sticker-packs.controller";
import { StickerPacksService } from "./sticker-packs.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([StickerPack, StickerPackInvite]),
    StickersModule,
  ],
  controllers: [StickerPacksController, InviteController],
  providers: [StickerPacksService],
})
export class StickerPacksModule {}
