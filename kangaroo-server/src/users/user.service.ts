import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StickerPack } from "../sticker-packs/entities/sticker-pack.entity";
import { UserPrivateRo } from "./dto/response-user-private.dto";
import { UserPublicRo } from "./dto/response-user-public.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(StickerPack)
    private stickerPackRepository: Repository<StickerPack>
  ) {}

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }

  async create(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const user = this.userRepository.create({ username, email, password });
    return this.userRepository.save(user);
  }

  async getOwnedStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository.find({
      where: { author: { id: userId } },
      relations: ["author"],
    });

    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

  async getPrivateUser(userId: string): Promise<UserPrivateRo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async getPublicUser(userId: string): Promise<UserPublicRo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      username: user.username,
    };
  }

  async getJoinedStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.author", "author")
      .leftJoinAndSelect("stickerpack.members", "member")
      .leftJoinAndSelect("stickerpack.stickers", "sticker")
      .leftJoinAndSelect(
        "sticker.whatsAppStickerImageFile",
        "whatsAppStickerImageFile"
      )
      .leftJoinAndSelect(
        "sticker.whatsAppIconImageFile",
        "whatsAppIconImageFile"
      )
      .where("member.id = :id", { id: userId })
      .getMany();

    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

  async getOwnedAndJoinedStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.author", "author")
      .leftJoinAndSelect("stickerpack.members", "member")
      .leftJoinAndSelect("stickerpack.stickers", "sticker")
      .leftJoinAndSelect(
        "sticker.whatsAppStickerImageFile",
        "whatsAppStickerImageFile"
      )
      .leftJoinAndSelect(
        "sticker.whatsAppIconImageFile",
        "whatsAppIconImageFile"
      )
      .where("member.id = :id", { id: userId })
      .orWhere("author.id =:id", { id: userId })
      .getMany();

    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }
}
