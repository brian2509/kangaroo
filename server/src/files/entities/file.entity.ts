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

@Entity("file")
export class PublicFile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bucketName: string;

  @ManyToOne(() => User, (user) => user.stickers)
  fileName: string;

  @OneToMany(() => Sticker, (sticker) => sticker.file)
  stickers?: Sticker[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
