import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PrivateFile } from "../../files/entities/file.entity";
import { StickerPack } from "../../sticker-packs/entities/sticker-pack.entity";
import { User } from "../../users/entities/user.entity";
import { StickerRo } from "../dto/response-sticker.dto";

@Entity("sticker")
export class Sticker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.stickers)
  author: User;

  @ManyToOne(() => StickerPack, (stickerPack) => stickerPack.stickers)
  stickerPack: StickerPack;

  @ManyToOne(() => PrivateFile, (file) => file.stickers, { eager: true })
  file: PrivateFile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toRO(): StickerRo {
    return {
      id: this.id,
      name: this.name,
      url: this.file.fileUrl(),
    };
  }
}
