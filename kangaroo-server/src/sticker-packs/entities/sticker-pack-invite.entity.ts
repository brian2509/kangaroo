import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InviteRoDto } from "../dto/invite-ro.dto";
import { StickerPack } from "./sticker-pack.entity";

@Entity()
export class StickerPackInvite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  expireTime: Date;

  @ManyToOne(() => StickerPack, (stickerPack) => stickerPack.invites)
  stickerPack: StickerPack;

  toRO(): InviteRoDto {
    return {
      id: this.id,
      expireTime: this.expireTime,
    };
  }
}
