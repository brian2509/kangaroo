import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { Sticker } from "./entities/sticker.entity";
import { StickersController } from "./stickers.controller";
import { StickersService } from "./stickers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UserModule],
  controllers: [StickersController],
  providers: [StickersService],
})
export class StickersModule {}
