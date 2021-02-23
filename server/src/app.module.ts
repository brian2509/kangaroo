import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HTTPLoggerMiddleware } from "./common/http-logger.middleware";
import { PrivateFile } from "./files/entities/file.entity";
import { FilesModule } from "./files/files.module";
import { StickerPack } from "./sticker-packs/entities/sticker-pack.entity";
import { StickerPacksModule } from "./sticker-packs/sticker-packs.module";
import { Sticker } from "./stickers/entities/sticker.entity";
import { StickersModule } from "./stickers/stickers.module";
import { User } from "./users/entities/user.entity";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [User, Sticker, PrivateFile, StickerPack],
      synchronize: true,
    }),
    UserModule,
    StickersModule,
    FilesModule,
    StickerPacksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    if (process.env.NODE_ENV === "development") {
      consumer.apply(HTTPLoggerMiddleware).forRoutes("*");
    }
  }
}
