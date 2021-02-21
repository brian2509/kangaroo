import * as bcrypt from "bcryptjs";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StickerPack } from "../../sticker-packs/entities/sticker-pack.entity";
import { Sticker } from "../../stickers/entities/sticker.entity";

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
