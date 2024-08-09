import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/*------------------------------------------------------------------------- [ App Controller ] -------------------------------------------------------------------------*/

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*------------------------------------------------------------------------- [ Server Test Controller ] -------------------------------------------------------------------------*/

  @ApiOperation({ summary: 'Get hello message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
