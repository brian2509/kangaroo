import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "../files/files.module";
import { UserModule } from "../users/user.module";
import { Sticker } from "./entities/sticker.entity";
import { StickersService } from "./stickers.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker]), UserModule, FilesModule],
  controllers: [],
  providers: [StickersService],
  exports: [StickersService],
})
export class StickersModule {}
