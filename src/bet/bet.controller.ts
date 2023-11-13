import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BetService } from './bet.service';
import { CreateBetDTO } from './dto/create-bet.dto';
import { BetEntity } from './entities/bet.entity';

@Controller('bet')
export class BetController {
  constructor(private readonly betService: BetService) {}

  @Post('/create')
  createBet(@Body() bet: CreateBetDTO): Promise<BetEntity> {
    return this.betService.createBet(bet);
  }

  @Get('/user/:id')
  getBetsByUserId(@Param() id: { id: string }): Promise<BetEntity[]> {
    return this.betService.getBetsByUserId(id);
  }
}
