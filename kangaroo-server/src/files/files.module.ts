import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sticker } from "../stickers/entities/sticker.entity";
import { PrivateFile } from "./entities/file.entity";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker, PrivateFile])],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
