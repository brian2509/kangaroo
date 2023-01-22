import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import {
  MulterFile,
  STICKER_VALIDATION_MULTER_ALL,
} from "../files/file.validation";
import {
  WHATSAPP_STICKER_HEIGHT_PX,
  WHATSAPP_STICKER_SIZE_ANIMATED_KB,
  WHATSAPP_STICKER_SIZE_NON_ANIMATED_KB,
  WHATSAPP_STICKER_WIDTH_PX,
} from "../stickers/constants/whatsapp.constants";
import { CreateStickerDto } from "../stickers/dto/create-sticker.dto";
import { StickerRo } from "../stickers/dto/response-sticker.dto";
import { UserRo } from "../users/dto/response-user.dto";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { CreateStickerPackDto } from "./dto/create-sticker-pack.dto";
import { InviteRoDto } from "./dto/invite-ro.dto";
import { StickerPackRo } from "./dto/sticker-pack-ro.dto";
import { UpdateStickerPackDto } from "./dto/update-sticker-pack.dto";
import { StickerPacksService } from "./sticker-packs.service";

@UseGuards(JwtAuthGuard)
@ApiTags("sticker-packs")
@ApiBearerAuth()
@Controller("sticker-packs")
export class StickerPacksController {
  constructor(private readonly stickerPacksService: StickerPacksService) {}

  @ApiOperation({
    summary: "Create a sticker pack (without stickers).",
  })
  @Post()
  async create(
    @Body() createStickerPackDto: CreateStickerPackDto,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.create(createStickerPackDto, user.id);
  }

  @ApiOperation({
    summary: "Update a sticker pack.",
  })
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateStickerPackDto: UpdateStickerPackDto,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.update(id, updateStickerPackDto, user.id);
  }

  @ApiOperation({
    summary: "Delete a sticker pack.",
  })
  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.remove(id, user.id);
  }

  @UseInterceptors(FileInterceptor("file", STICKER_VALIDATION_MULTER_ALL))
  @ApiOperation({
    summary: `Add a sticker to a sticker pack you own or a member of. See description for requirements.`,
    description: `
    1. In animated packs only gifs can be uploaded, in non-animated packs only jpg/png.
    2. Files uploaded must be square.
    3. File must be less than ${WHATSAPP_STICKER_SIZE_NON_ANIMATED_KB} KB for non-animated stickers and ${WHATSAPP_STICKER_SIZE_ANIMATED_KB} KB or animated stickers.
    4. Try to keep the dimensions close to ${WHATSAPP_STICKER_HEIGHT_PX}x${WHATSAPP_STICKER_WIDTH_PX} (whatsapp-spec), however if not possible it will be resized on back-end.`,
  })
  @Post(":id/stickers")
  async addSticker(
    @Param("id") id: string,
    @Body() createStickerDto: CreateStickerDto,
    @UploadedFile() file: MulterFile,
    @User() user: UserRo
  ): Promise<StickerRo> {
    return this.stickerPacksService.addSticker(
      id,
      createStickerDto,
      file,
      user.id
    );
  }

  @ApiOperation({
    summary: "Remove a sticker to a sticker pack you own or a member of.",
  })
  @Delete(":id/stickers/:stickerId")
  async deleteSticker(
    @Param("id") id: string,
    @Param("stickerId") stickerId: string,
    @User() user: UserRo
  ): Promise<StickerRo> {
    return this.stickerPacksService.removeSticker(id, stickerId, user.id);
  }

  @ApiOperation({
    summary: "Get a list of all sticker packs which are public.",
  })
  @Get()
  findAllPublicPacks(): Promise<StickerPackRo[]> {
    return this.stickerPacksService.findAllPublicPacks();
  }

  @ApiOperation({
    summary:
      "Get a sticker pick which is public or which you own or which you are a member of.",
  })
  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.findOne(id, user.id);
  }

  @ApiOperation({
    summary: "Leave a sticker pack which you are a member of.",
  })
  @Post(":id/actions/leave")
  async leaveStickerPack(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.leaveStickerPack(id, user.id);
  }

  @ApiOperation({
    summary: "Register a view for a sticker pack.",
  })
  @Get(":id/actions/registerView")
  async registerView(@Param("id") id: string) {
    await this.stickerPacksService.registerView(id);
    return;
  }

  @ApiOperation({
    summary: "Register a click for a sticker pack.",
  })
  @Get(":id/actions/registerClick")
  async registerLike(@Param("id") id: string) {
    await this.stickerPacksService.registerClick(id);
    return;
  }

  @ApiOperation({
    summary: "Register a like for a sticker pack.",
  })
  @Get(":id/actions/like")
  async likeStickerPack(@Param("id") id: string, @User() user: UserRo) {
    await this.stickerPacksService.likeStickerPack(id, user.id);
    return;
  }

  @ApiOperation({
    summary: "Register a unlike for a sticker pack.",
  })
  @Get(":id/actions/unlike")
  async unlikeStickerPack(@Param("id") id: string, @User() user: UserRo) {
    await this.stickerPacksService.unlikeStickerPack(id, user.id);
    return;
  }

  @ApiOperation({
    summary: "Get invites for a sticker pack.",
  })
  @Get(":id/invites")
  async getInvites(
    @Param("id") id: string,
    @User() user: UserRo
  ): Promise<InviteRoDto[]> {
    return await this.stickerPacksService.getInvites(id, user.id);
  }

  @ApiOperation({
    summary:
      "Create invite for a sticker pack. If no expire time is set, the time is infinite.",
  })
  @Post(":id/invites")
  async createInvite(
    @Param("id") id: string,
    @User() user: UserRo,
    @Body() createInviteDto: CreateInviteDto
  ): Promise<InviteRoDto> {
    return await this.stickerPacksService.createInvite(
      id,
      user.id,
      createInviteDto
    );
  }

  @ApiOperation({
    summary: "Remove invite for a sticker pack.",
  })
  @Delete(":id/invites/:inviteId")
  async removeInvite(
    @Param("id") id: string,
    @Param("inviteId") inviteId: string,
    @User() user: UserRo
  ): Promise<InviteRoDto> {
    return await this.stickerPacksService.removeInvite(id, inviteId, user.id);
  }

  @ApiOperation({
    summary: "Kick a user from a sticker pack.",
  })
  @Post(":id/kick/:userIdToBeKicked")
  async kickMember(
    @Param("id") id: string,
    @Param("userIdToBeKicked") userIdToBeKicked: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return this.stickerPacksService.kickMember(id, user.id, userIdToBeKicked);
  }
}
