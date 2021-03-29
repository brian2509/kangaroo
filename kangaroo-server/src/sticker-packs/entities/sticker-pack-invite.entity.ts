import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InviteRo } from "../dto/invite-ro";
import { StickerPack } from "./sticker-pack.entity";

@Entity()
export class StickerPackInvite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  expireTime: Date;

  @ManyToOne(() => StickerPack, (stickerPack) => stickerPack.invites)
  stickerPack: StickerPack;

  toRO(): InviteRo {
    return {
      id: this.id,
      expireTime: this.expireTime,
      link: this.url(),
    };
  }

  url(): string {
    return `${process.env.DOMAIN_NAME}/api/invites/${this.id}`;
  }
}
