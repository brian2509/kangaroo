import { Controller, Get, Param, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { FilesService } from "./files.service";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({
    summary:
      "Get a particular file, generally not used stand-alone but with through given URL.",
  })
  @Get(":fileName")
  async getFile(@Param("fileName") fileName: string, @Res() res: Response) {
    // TODO: Add security to this if needed.
    const file = await this.filesService.getFile(fileName);
    file.stream.pipe(res);
  }
}
