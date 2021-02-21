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

  async mockUser(): Promise<User> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      const user = this.userRepository.create({
        email: "mock@email.com",
        username: "mock_username",
      });
      await this.userRepository.save(user);
    }
    return (await this.userRepository.find())[0];
  }

  async getOwnStickerPacks(userId: string) {
    const stickerPacks = await this.stickerPackRepository.find({
      where: { author: { id: userId } },
      relations: ["author"],
    });
    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

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
}
