import * as bcrypt from "bcryptjs";
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StickerPack } from "../../sticker-packs/entities/sticker-pack.entity";
import { Sticker } from "../../stickers/entities/sticker.entity";
import { UserRo } from "../dto/response-user.dto";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Sticker, (sticker) => sticker.author)
  stickers: Sticker[];

  @OneToMany(() => Sticker, (sticker) => sticker.author)
  stickerPacks: StickerPack[];

  @ManyToMany(() => StickerPack, (stickerPack) => stickerPack.members)
  joinedStickerPacks: StickerPack[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toRo(): UserRo {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
