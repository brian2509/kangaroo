import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StickerPack } from "./sticker-pack.entity";

@Entity()
export class StickerPackInvite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expireTime: Date;

  @Column()
  infinite: boolean;

  @ManyToOne(() => StickerPack, (stickerPack) => stickerPack.invites)
  stickerPack: StickerPack;
}
