import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/user.service";
import { CreateStickerDto } from "./dto/create-sticker.dto";
import { StickerRo } from "./dto/response-sticker.dto";
import { UpdateStickerDto } from "./dto/update-sticker.dto";
import { Sticker } from "./entities/sticker.entity";

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(Sticker) private stickerRepository: Repository<Sticker>,
    private usersService: UsersService
  ) {}

  async create(createStickerDto: CreateStickerDto): Promise<StickerRo> {
    const user = await this.usersService.mockUser();
    const sticker = this.stickerRepository.create({
      author: user,
      name: createStickerDto.name,
    });
    const savedSticker = await this.stickerRepository.save(sticker);
    return {
      id: savedSticker.id,
      name: savedSticker.name,
    };
  }

  async findAll(): Promise<StickerRo[]> {
    const stickers = await this.stickerRepository.find();
    return stickers.map((sticker) => {
      return { id: sticker.id, name: sticker.name };
    });
  }

  async findOne(id: string): Promise<StickerRo> {
    const sticker = await this.stickerRepository.findOne({
      where: { id },
    });
    if (!sticker) {
      throw new NotFoundException();
    }
    return {
      id: sticker.id,
      name: sticker.name,
    };
  }

  async update(
    id: string,
    updateStickerDto: UpdateStickerDto
  ): Promise<StickerRo> {
    const sticker = await this.findOne(id);
    const updatedSticker = { ...sticker, ...updateStickerDto };
    const saved = await this.stickerRepository.save(updatedSticker);
    return {
      id: saved.id,
      name: saved.name,
    };
  }

  async remove(id: string): Promise<StickerRo> {
    const sticker = await this.findOne(id);
    await this.stickerRepository.delete(id);
    return sticker;
  }
}
