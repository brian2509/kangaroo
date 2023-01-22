import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @ManyToOne(() => User, (user) => user.stickers, { eager: true })
  author: User;

  @ManyToOne(() => StickerPack, (stickerPack) => stickerPack.stickers)
  stickerPack: StickerPack;

  @OneToOne(() => PrivateFile, { eager: true })
  @JoinColumn()
  whatsAppStickerImageFile: PrivateFile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toRO(): StickerRo {
    return {
      id: this.id,
      name: this.name,
      author: this.author.toRo(),
      fileUrl: this.whatsAppStickerImageFile.fileUrl(),
      whatsAppStickerImageFileUrl: this.whatsAppStickerImageFile.fileUrl(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
