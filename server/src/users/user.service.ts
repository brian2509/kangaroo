import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StickerPack } from "../sticker-packs/entities/sticker-pack.entity";
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

  async getJoinedStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.members", "member")
      .where("member.id = :id", { id: userId })
      .getMany();

    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

  async getOwnedAndJoinedStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.author", "author")
      .leftJoinAndSelect("stickerpack.members", "member")
      .where("member.id = :id", { id: userId })
      .orWhere("author.id =:id", { id: userId })
      .getMany();

    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }
}
