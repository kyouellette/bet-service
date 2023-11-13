import { Module } from '@nestjs/common';
import { BetGroupController } from './bet-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetGroupEntity } from './entities/bet-group.entity';
import { BetGroupService } from './bet-group.service';
import { BetOptionsEntity } from './entities/bet-options.entity';
import { BetModule } from '../bet/bet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BetGroupEntity, BetOptionsEntity]),
    BetModule,
  ],
  providers: [BetGroupService],
  controllers: [BetGroupController],
})
export class BetGroupModule {}
