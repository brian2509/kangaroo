import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HTTPLoggerMiddleware } from "./common/middleware/http-logger.middleware";
import { PrivateFile } from "./files/entities/file.entity";
import { FilesModule } from "./files/files.module";
import { StickerPackInvite } from "./sticker-packs/entities/sticker-pack-invite.entity";
import { StickerPack } from "./sticker-packs/entities/sticker-pack.entity";
import { StickerPacksModule } from "./sticker-packs/sticker-packs.module";
import { Sticker } from "./stickers/entities/sticker.entity";
import { StickersModule } from "./stickers/stickers.module";
import { User } from "./users/entities/user.entity";
import { UserModule } from "./users/user.module";
import { Environment, Config } from "./env.validation";
import { dotenvLoader, TypedConfigModule } from "nest-typed-config/index";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: Config) => ({
        type: "postgres",
        url: `postgres://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_PASSWORD}:${config.POSTGRES_HOST}/${config.POSTGRES_DB}`,
        entities: [User, Sticker, PrivateFile, StickerPack, StickerPackInvite],
        synchronize: config.NODE_ENV === Environment.DEVELOPMENT,
      }),
    }),
    TypedConfigModule.forRoot({
      schema: Config,
      load: dotenvLoader({ envFilePath: ".env" }),
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
