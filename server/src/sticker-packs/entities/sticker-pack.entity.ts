import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => User, (user) => user.joinedStickerPacks, { eager: true })
  @JoinTable()
  members: User[];

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
      members: !this.members ? [] : this.members.map((member) => member.toRo()),
    };
  }

  isOwner(userId: string) {
    return this.author.id !== userId;
  }

  isMember(userId: string) {
    return (
      this.members &&
      this.members.filter((member) => member.id === userId).length > 0
    );
  }
}
