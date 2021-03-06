import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "../files/files.module";
import { UserModule } from "../users/user.module";
import { Sticker } from "./entities/sticker.entity";
import { ImagesService } from "./images.service";
import { StickersService } from "./stickers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UserModule, FilesModule],
  controllers: [],
  providers: [StickersService, ImagesService],
  exports: [StickersService],
})
export class StickersModule {}
