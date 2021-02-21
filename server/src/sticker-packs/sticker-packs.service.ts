import {ForbiddenException, Injectable, NotFoundException,} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateStickerDto} from "../stickers/dto/create-sticker.dto";
import {StickersService} from "../stickers/stickers.service";
import {CreateStickerPackDto} from "./dto/create-sticker-pack.dto";
import {StickerPackRo} from "./dto/sticker-pack-ro.dto";
import {UpdateStickerPackDto} from "./dto/update-sticker-pack.dto";
import {StickerPack} from "./entities/sticker-pack.entity";

@Injectable()
export class StickerPacksService {
  constructor(
    @InjectRepository(StickerPack)
    private stickerPackRepository: Repository<StickerPack>,
    private stickersService: StickersService
  ) {
  }

  async create(
    createStickerPackDto: CreateStickerPackDto,
    userId: string
  ): Promise<StickerPackRo> {
    const stickerPack = this.stickerPackRepository.create({
      name: createStickerPackDto.name,
      private: createStickerPackDto.private,
      author: {id: userId},
    });
    const result = await this.stickerPackRepository.save(stickerPack);
    return result.toRO();
  }

  async update(
    id: string,
    updateStickerPackDto: UpdateStickerPackDto,
    userId: string
  ): Promise<StickerPackRo> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: {id},
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }
    if (stickerPack.author.id !== userId) {
      throw new ForbiddenException("Not the owner of the pack.");
    }
    const updatedSticker = await this.stickerPackRepository.save({
      ...stickerPack,
      ...updateStickerPackDto,
    });

    // TODO: make this faster.
    return (await this.stickerPackRepository.findOne(stickerPack.id)).toRO();
  }

  async remove(id: string, userId: string): Promise<StickerPackRo> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: {id},
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (stickerPack.author.id !== userId) {
      throw new ForbiddenException(
        "You are not the author of this sticker pack."
      );
    }

    // TODO: make this faster.
    const stickers = stickerPack.stickers;
    if (stickers) {
      for (const sticker of stickers) {
        await this.stickersService.remove(sticker.id);
      }
    }
    await this.stickerPackRepository.delete(id);
    return stickerPack.toRO();
  }

  async addSticker(
    id: string,
    createStickerDto: CreateStickerDto,
    file: any,
    userId: string
  ) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: {id},
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException("Did not find sticker pack with this ID.");
    }

    if (stickerPack.author.id !== userId) {
      throw new ForbiddenException(
        "You are not the author of this sticker pack."
      );
    }

    return await this.stickersService.create(
      id,
      createStickerDto,
      file,
      userId
    );
  }

  async removeSticker(id: string, stickerId: string, userId: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: {id},
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (stickerPack.author.id !== userId) {
      throw new ForbiddenException(
        "You are not the author of this sticker pack."
      );
    }

    return await this.stickersService.remove(stickerId);
  }

  copySticker(id: string, stickerId: string, userId: string) {
    // TODO: Not implemented.
    return `This action returns a #${id} stickerPack`;
  }

  async findAll(): Promise<StickerPackRo[]> {
    // TODO: This is a temp route.
    const stickerPacks = await this.stickerPackRepository.find();
    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

  async findOne(id: string, userId: string): Promise<StickerPackRo> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: {id},
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }
    if (stickerPack.private && stickerPack.author.id !== userId) {
      throw new ForbiddenException("This sticker pack is private.");
    }
    return stickerPack.toRO();
  }
}