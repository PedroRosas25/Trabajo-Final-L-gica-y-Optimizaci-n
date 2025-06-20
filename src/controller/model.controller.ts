import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModelService } from '../service/model.service';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post('upload-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadData(@UploadedFile() file: Express.Multer.File) {
    return this.modelService.parseCsv(file);
  }

  @Post('execute')
  executeModel(@Body() data: any) {
    return this.modelService.executeModel(data);
  }

  @Get('status/:runId')
  checkStatus(@Param('runId') runId: string) {
    return this.modelService.checkRunStatus(runId);
  }

  @Get('results/:runId')
  getResults(@Param('runId') runId: string) {
    return this.modelService.getResults(runId);
  }
}
