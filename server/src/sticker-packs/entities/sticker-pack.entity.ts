import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sticker } from "../../stickers/entities/sticker.entity";
import { User } from "../../users/entities/user.entity";
import { StickerPackRo } from "../dto/sticker-pack-ro.dto";

@Entity("stickerpack")
export class StickerPack {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  private: boolean;

  @ManyToOne(() => User, (user) => user.stickers)
  author: User;

  @OneToMany(() => Sticker, (sticker) => sticker.stickerPack, { eager: true })
  stickers: Sticker[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toRO(): StickerPackRo {
    return {
      id: this.id,
      name: this.name,
      private: this.private,
      stickers: !this.stickers
        ? []
        : this.stickers.map((sticker) => sticker.toRO()),
    };
  }
}
