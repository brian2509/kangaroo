import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StickerPack } from "../../sticker-packs/entities/sticker-pack.entity";
import { Sticker } from "../../stickers/entities/sticker.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @OneToMany(() => Sticker, (sticker) => sticker.author)
  stickers: Sticker[];

  @OneToMany(() => Sticker, (sticker) => sticker.author)
  stickerPacks: StickerPack[];
}
