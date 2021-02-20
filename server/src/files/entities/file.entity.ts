import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sticker } from "../../stickers/entities/sticker.entity";

@Entity("file")
export class PublicFile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  bucketName: string;

  @Column()
  fileName: string;

  @Column()
  url: string;

  @OneToMany(() => Sticker, (sticker) => sticker.file)
  stickers?: Sticker[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
