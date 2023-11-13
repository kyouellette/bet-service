import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateBetGroupDTO } from './dto/create-betgroup.dto';
import { BetGroupService } from './bet-group.service';
import { BetGroupEntity } from './entities/bet-group.entity';
import { IndividualBetResultEntity } from './entities/individual-bet-result';

@Controller('group')
export class BetGroupController {
  constructor(private readonly betGroupService: BetGroupService) {}

  @Post('/create')
  createBetGroup(@Body() betGroup: CreateBetGroupDTO): Promise<BetGroupEntity> {
    return this.betGroupService.createNewBetGroup(betGroup);
  }

  @Get('/streamer/:twitchUsername')
  getStreamerOpenBetGroup(
    @Param() twitchUsername: { twitchUsername: string },
  ): Promise<BetGroupEntity> {
    return this.betGroupService.getOpenBetGroupForStreamer(twitchUsername);
  }

  @Get('/')
  getAllBetGroups(): Promise<BetGroupEntity[]> {
    return this.betGroupService.getBetGroups();
  }

  @Patch('/resolve/:id')
  resolveBetsByBetGroup(
    @Param() id: { id: string },
    @Body() results: IndividualBetResultEntity[],
  ): Promise<BetGroupEntity> {
    return this.betGroupService.resolveBetsByBetGroup(id, results);
  }

  @Patch('/close/:betGroupId')
  getTwitchUsernames(@Param() data: { betGroupId: string }): Promise<string> {
    return this.betGroupService.closeBetGroup(data);
  }
}
