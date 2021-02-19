import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sticker } from "./stickers/entities/sticker.entity";
import { User } from "./user/entities/user.entity";
import { UserModule } from "./user/user.module";
import { StickersModule } from "./stickers/stickers.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [User, Sticker],
      synchronize: true,
    }),
    UserModule,
    StickersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
