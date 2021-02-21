import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StickerPack } from "../sticker-packs/entities/sticker-pack.entity";
import { User } from "./entities/user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User, StickerPack])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UserModule {}
