import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MulterFile } from "../files/file.validation";
import { FilesService } from "../files/files.service";
import { WHATSAPP_MAX_PACK_SIZE } from "../stickers/constants/whatsapp.constants";
import { CreateStickerDto } from "../stickers/dto/create-sticker.dto";
import { Sticker } from "../stickers/entities/sticker.entity";
import { ImagesService } from "../stickers/images.service";
import { StickersService } from "../stickers/stickers.service";
import { streamToBuffer } from "../util/streams";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { CreateStickerPackDto } from "./dto/create-sticker-pack.dto";
import { InviteRoDto } from "./dto/invite-ro.dto";
import { StickerPackRo } from "./dto/sticker-pack-ro.dto";
import { UpdateStickerPackDto } from "./dto/update-sticker-pack.dto";
import { StickerPackInvite } from "./entities/sticker-pack-invite.entity";
import { StickerPack } from "./entities/sticker-pack.entity";

@Injectable()
export class StickerPacksService {
  constructor(
    @InjectRepository(StickerPack)
    private stickerPackRepository: Repository<StickerPack>,
    @InjectRepository(Sticker)
    private stickerRepository: Repository<Sticker>,
    @InjectRepository(StickerPackInvite)
    private inviteRepository: Repository<StickerPackInvite>,
    private stickersService: StickersService,
    private imagesService: ImagesService,
    private filesService: FilesService
  ) {}

  async create(
    createStickerPackDto: CreateStickerPackDto,
    userId: string
  ): Promise<StickerPackRo> {
    const stickerPack = this.stickerPackRepository.create({
      ...createStickerPackDto,
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
    if (
      stickerPack.stickers.length > 0 &&
      updateStickerPackDto.animated !== stickerPack.animated
    ) {
      throw new ForbiddenException(
        "You can not change the animation status of this pack, because there are still stickers in it."
      );
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
      throw new NotFoundException("Did not find sticker with this ID.");
    }

    if (!stickerPack.isOwner(userId) && !stickerPack.isMember(userId)) {
      throw new ForbiddenException(
        "You are not the author or a member of this sticker pack."
      );
    }

    if (stickerPack.stickers.length >= WHATSAPP_MAX_PACK_SIZE) {
      throw new ForbiddenException(
        `This pack is full. The maximum amount of stickers in a pack is ${WHATSAPP_MAX_PACK_SIZE}.`
      );
    }

    const stickerRo = await this.stickersService.create(
      id,
      createStickerDto,
      file,
      stickerPack.animated,
      userId
    );

    // Manually change the updatedAt attribute on the sticker pack
    stickerPack.updatedAt = new Date();
    await this.stickerPackRepository.save(stickerPack);

    return stickerRo;
  }

  async setTrayIcon(id: string, file: MulterFile | Buffer, userId: string) {
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

    const buffer = file instanceof Buffer ? file : file.buffer;
    const whatsAppIconImage = await this.imagesService.createWhatsappIcon(
      buffer
    );

    stickerPack.whatsAppIconImageFile = await this.filesService.uploadFile(
      whatsAppIconImage,
      "whatsapp-icon.png"
    );
    await this.stickerPackRepository.save(stickerPack);

    return stickerPack.toRO();
  }

  async setTrayIconFromExistingSticker(
    id: string,
    stickerId: string,
    userId: string
  ) {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });

    const sticker = await this.stickerRepository.findOne({
      where: { id: stickerId },
    });

    if (!stickerPack) {
      throw new NotFoundException("Did not find sticker pack with this ID.");
    }

    if (!sticker) {
      throw new NotFoundException("Did not find sticker with this ID.");
    }

    if (!stickerPack.isOwner(userId) && !stickerPack.isMember(userId)) {
      throw new ForbiddenException(
        "You are not the author or a member of this sticker pack."
      );
    }

    // Check if sticker is located in the pack.
    if (
      stickerPack.stickers.find((sticker) => sticker.id === stickerId) ===
      undefined
    ) {
      throw new ForbiddenException("The sticker is not located in this pack.");
    }

    const file = await this.filesService.getFile(
      sticker.whatsAppStickerImageFile.fileName
    );
    const buffer = await streamToBuffer(file.stream);

    // TODO: Some redundant DB operations here when calling this function.
    return this.setTrayIcon(id, buffer, userId);
  }

  async deleteTrayIcon(id: string, userId: string) {
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

    const file = stickerPack.whatsAppIconImageFile;
    if (file) {
      await this.filesService.deleteFile(file.fileName);
    }
    stickerPack.whatsAppIconImageFile = undefined;
    await this.stickerRepository.save(stickerPack);

    return stickerPack.toRO();
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

    const stickerRo = await this.stickersService.remove(stickerId);

    // Manually change the updatedAt attribute on the sticker pack
    stickerPack.updatedAt = new Date();
    await this.stickerPackRepository.save(stickerPack);

    return stickerRo;
  }

  async findAllPublicPacks(): Promise<StickerPackRo[]> {
    const stickerPacks = await this.stickerPackRepository.find({
      where: { personal: false },
      order: { createdAt: "ASC" },
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
      stickerPack.personal &&
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

  async getInvites(id: string, userId: string): Promise<InviteRoDto[]> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (!stickerPack.isOwner(userId)) {
      throw new ForbiddenException("Only the owner can see invites.");
    }

    const invites = await this.inviteRepository.find({
      where: { stickerPack: { id } },
    });

    // Delete expired invites.
    const currentTime = new Date();
    if (invites && invites.length > 0) {
      const expiredInvites = invites.filter(
        (invite) => invite.expireTime && currentTime > invite.expireTime
      );
      if (expiredInvites.length > 0) {
        await this.inviteRepository.delete(
          expiredInvites.map((invite) => invite.id)
        );
      }
    }

    const freshInvites = await this.inviteRepository.find({
      where: { stickerPack: { id } },
    });

    return freshInvites.map((invite) => invite.toRO());
  }

  async createInvite(
    id: string,
    userId: string,
    createInviteDto: CreateInviteDto
  ): Promise<InviteRoDto> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (!stickerPack.isOwner(userId)) {
      throw new ForbiddenException("Only the owner can make invite links.");
    }

    // Check if the expire date is set in the future.
    const currentTime = new Date();
    if (
      createInviteDto.expireTime &&
      currentTime > new Date(createInviteDto.expireTime)
    ) {
      throw new ForbiddenException("Expire time should be set in the future.");
    }

    // If expire time is not given, set it to null (interpreted as infinite later).
    const expireTime = createInviteDto.expireTime
      ? createInviteDto.expireTime
      : null;

    const invite = this.inviteRepository.create({
      expireTime: expireTime,
      stickerPack: { id },
    });

    await this.inviteRepository.save(invite);
    return invite.toRO();
  }

  async removeInvite(
    id: string,
    inviteId: string,
    userId: string
  ): Promise<InviteRoDto> {
    const stickerPack = await this.stickerPackRepository.findOne({
      where: { id },
      relations: ["author"],
    });
    if (!stickerPack) {
      throw new NotFoundException();
    }

    if (!stickerPack.isOwner(userId)) {
      throw new ForbiddenException("Only the owner can delete invites.");
    }

    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException("This invite does not exist.");
    }

    await this.inviteRepository.delete(inviteId);

    return invite.toRO();
  }

  async useInvite(inviteId: string, userId: string): Promise<StickerPackRo> {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
      relations: ["stickerPack"],
    });

    if (!invite) {
      throw new NotFoundException("This invite does not exist/has expired.");
    }

    // Check if invite has expired.
    const currentTime = new Date();
    if (invite.expireTime && currentTime > invite.expireTime) {
      await this.inviteRepository.delete(inviteId);
      throw new NotFoundException("This invite does not exist/has expired.");
    }

    return await this.joinStickerPack(invite.stickerPack.id, userId);
  }

  async previewInvite(inviteId: string): Promise<StickerPackRo> {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
      relations: ["stickerPack"],
    });

    if (!invite) {
      throw new NotFoundException("This invite does not exist/has expired.");
    }

    // Check if invite has expired.
    const currentTime = new Date();
    if (invite.expireTime && currentTime > invite.expireTime) {
      await this.inviteRepository.delete(inviteId);
      throw new NotFoundException("This invite does not exist/has expired.");
    }

    const stickerPack = await this.stickerPackRepository.findOne(
      invite.stickerPack.id
    );
    return stickerPack.toRO();
  }
}
