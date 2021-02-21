import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { FilesService } from "./files.service";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get(":fileName")
  @UseGuards(JwtAuthGuard)
  async getFile(@Param("fileName") fileName: string, @Res() res: Response) {
    // TODO: Add security to this if needed.
    const file = await this.filesService.getFile(fileName);
    file.stream.pipe(res);
  }
}
