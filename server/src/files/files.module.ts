import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sticker } from "../stickers/entities/sticker.entity";
import { PublicFile } from "./entities/file.entity";
import { FilesService } from "./files.service";

@Module({
  imports: [TypeOrmModule.forFeature([Sticker, PublicFile])],
  providers: [FilesService],
})
export class FilesModule {}
