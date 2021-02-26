import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MulterFile } from "../files/file.validation";
import { CreateStickerDto } from "../stickers/dto/create-sticker.dto";
import { StickersService } from "../stickers/stickers.service";
import { CreateStickerPackDto } from "./dto/create-sticker-pack.dto";
import { StickerPackRo } from "./dto/sticker-pack-ro.dto";
import { UpdateStickerPackDto } from "./dto/update-sticker-pack.dto";
import { StickerPack } from "./entities/sticker-pack.entity";

@Injectable()
export class StickerPacksService {
  constructor(
    @InjectRepository(StickerPack)
    private stickerPackRepository: Repository<StickerPack>,
    private stickersService: StickersService
  ) {}

  async create(
    createStickerPackDto: CreateStickerPackDto,
    userId: string
  ): Promise<StickerPackRo> {
    const stickerPack = this.stickerPackRepository.create({
      name: createStickerPackDto.name,
      private: createStickerPackDto.private,
      author: { id: userId },
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
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }
    if (!stickerPack.isOwner(userId)) {
      throw new ForbiddenException("Not the owner of the pack.");
    }
    await this.stickerPackRepository.save({
      ...stickerPack,
      ...updateStickerPackDto,
    });
    // TODO: make this faster.
    return (await this.stickerPackRepository.findOne(stickerPack.id)).toRO();
  }

  async remove(id: string, userId: string): Promise<StickerPackRo> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (!stickerPack.isOwner(userId)) {
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
    file: MulterFile,
    userId: string
  ) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException("Did not find sticker pack with this ID.");
    }

    if (!stickerPack.isOwner(userId) && !stickerPack.isMember(userId)) {
      throw new ForbiddenException(
        "You are not the author or a member of this sticker pack."
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
      where: { id },
      relations: ["author"],
    });

    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (!stickerPack.isOwner(userId) && !stickerPack.isMember(userId)) {
      throw new ForbiddenException(
        "You are not the author or a member of this sticker pack."
      );
    }

    return await this.stickersService.remove(stickerId);
  }

  async findAllPublicPacks(): Promise<StickerPackRo[]> {
    const stickerPacks = await this.stickerPackRepository.find({
      where: { private: false },
    });
    return stickerPacks.map((stickerPack) => stickerPack.toRO());
  }

  async findOne(id: string, userId: string): Promise<StickerPackRo> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (
      stickerPack.private &&
      !stickerPack.isOwner(userId) &&
      !stickerPack.isMember(userId)
    ) {
      throw new ForbiddenException("This sticker pack is private.");
    }

    return stickerPack.toRO();
  }

  async joinStickerPack(id: string, userId: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException("This sticker pack does not exist.");
    }
    if (stickerPack.isOwner(userId)) {
      throw new ForbiddenException("You can't join your own sticker pack.");
    }
    if (!stickerPack.isOwner(userId) && stickerPack.private) {
      throw new ForbiddenException(
        "Not allowed to join this private sticker pack."
      );
    }
    if (stickerPack.isMember(userId)) {
      throw new ForbiddenException("You already joined this sticker pack.");
    }
    const newStickerPack = {
      ...stickerPack,
      members: [...stickerPack.members, { id: userId }],
    };
    const result = await this.stickerPackRepository.save(newStickerPack);
    const reFetch = await this.stickerPackRepository.findOne({
      where: { id: result.id },
    });
    return reFetch.toRO();
  }

  async leaveStickerPack(id: string, userId: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException("This sticker pack does not exist.");
    }
    if (stickerPack.isMember(userId)) {
      const newStickerPack = {
        ...stickerPack,
        members: stickerPack.members.filter((member) => member.id !== userId),
      };
      const result = await this.stickerPackRepository.save(newStickerPack);
      const reFetch = await this.stickerPackRepository.findOne({
        where: { id: result.id },
      });
      return reFetch.toRO();
    }
    throw new ForbiddenException("You are not a member of this sticker pack.");
  }

  async registerView(id: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }
    stickerPack.views = stickerPack.views + 1;
    await this.stickerPackRepository.save(stickerPack);
  }

  async registerClick(id: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }
    stickerPack.clicks = stickerPack.clicks + 1;
    await this.stickerPackRepository.save(stickerPack);
  }

  async likeStickerPack(id: string, userId: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    const like = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.likedBy", "likedByUser")
      .where("likedByUser.id = :id", { id: userId })
      .getOne();

    if (like) {
      throw new ForbiddenException("You already liked this sticker pack.");
    }

    await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .relation(StickerPack, "likedBy")
      .of(stickerPack)
      .add(userId);

    stickerPack.likes = stickerPack.likes + 1;
    await this.stickerPackRepository.save(stickerPack);

    return;
  }

  async unlikeStickerPack(id: string, userId: string) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    const like = await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .leftJoinAndSelect("stickerpack.likedBy", "likedByUser")
      .where("likedByUser.id = :id", { id: userId })
      .getOne();

    if (!like) {
      throw new ForbiddenException("You have not liked this pack.");
    }

    await this.stickerPackRepository
      .createQueryBuilder("stickerpack")
      .relation(StickerPack, "likedBy")
      .of(stickerPack)
      .remove(userId);

    stickerPack.likes = Math.max(0, stickerPack.likes - 1);
    await this.stickerPackRepository.save(stickerPack);

    return;
  }
}
