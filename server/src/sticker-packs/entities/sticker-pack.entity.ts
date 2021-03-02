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

  @ManyToMany(() => User, (user) => user.liked)
  @JoinTable()
  likedBy: User[];

  @OneToMany(() => Sticker, (sticker) => sticker.stickerPack, { eager: true })
  stickers: Sticker[];

  @Column()
  animated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  clicks: number;

  @Column({ default: 0 })
  likes: number;

  @UpdateDateColumn()
  updatedAt: Date;

  toRO(): StickerPackRo {
    return {
      id: this.id,
      name: this.name,
      private: this.private,
      animated: this.animated,
      stickers: !this.stickers
        ? []
        : this.stickers.map((sticker) => sticker.toRO()),
      members: !this.members ? [] : this.members.map((member) => member.toRo()),
      views: this.views,
      likes: this.likes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isOwner(userId: string) {
    return this.author.id === userId;
  }

  isMember(userId: string) {
    return (
      this.members &&
      this.members.filter((member) => member.id === userId).length > 0
    );
  }
}
