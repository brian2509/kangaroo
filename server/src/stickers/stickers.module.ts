import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "../files/files.module";
import { UserModule } from "../users/user.module";
import { Sticker } from "./entities/sticker.entity";
import { StickersController } from "./stickers.controller";
import { StickersService } from "./stickers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UserModule, FilesModule],
  controllers: [StickersController],
  providers: [StickersService],
})
export class StickersModule {}
