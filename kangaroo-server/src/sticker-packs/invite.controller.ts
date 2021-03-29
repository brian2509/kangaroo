import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "../auth/decorators/user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserRo } from "../users/dto/response-user.dto";
import { StickerPackRo } from "./dto/sticker-pack-ro.dto";
import { StickerPacksService } from "./sticker-packs.service";

@UseGuards(JwtAuthGuard)
@ApiTags("invites")
@ApiBearerAuth()
@Controller("invites")
export class InviteController {
  constructor(private readonly stickerPacksService: StickerPacksService) {}

  @ApiOperation({
    summary: "Use invite for a sticker pack.",
  })
  @Get(":inviteId")
  async useInvite(
    @Param("inviteId") inviteId: string,
    @User() user: UserRo
  ): Promise<StickerPackRo> {
    return await this.stickerPacksService.useInvite(inviteId, user.id);
  }
}
