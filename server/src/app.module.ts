import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PublicFile } from "./files/entities/file.entity";
import { FilesModule } from "./files/files.module";
import { Sticker } from "./stickers/entities/sticker.entity";
import { StickersModule } from "./stickers/stickers.module";
import { User } from "./users/entities/user.entity";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [User, Sticker, PublicFile],
      synchronize: true,
    }),
    UserModule,
    StickersModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
