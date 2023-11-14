import { Injectable } from '@nestjs/common';
import { BetGroupEntity } from './entities/bet-group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBetGroupDTO } from './dto/create-betgroup.dto';
import { BetOptionsEntity } from './entities/bet-options.entity';
import { BetService } from '../bet/bet.service';
import { IndividualBetResultEntity } from './entities/individual-bet-result';

@Injectable()
export class BetGroupService {
  constructor(
    @InjectRepository(BetGroupEntity)
    private readonly betGroupRepository: Repository<BetGroupEntity>,
    @InjectRepository(BetOptionsEntity)
    private readonly betOptionsRepository: Repository<BetOptionsEntity>,
    private readonly betService: BetService,
  ) {}

  async createNewBetGroup(data: CreateBetGroupDTO): Promise<BetGroupEntity> {
    const { twitchUsername, betOptions } = data;
    try {
      const betGroup = await this.betGroupRepository.save({
        twitchUsername,
        active: true,
      });
      const saveOptionPromises = betOptions.map((option) => {
        return this.betOptionsRepository.save({
          ...option,
          betGroupId: betGroup.id,
        });
      });
      await Promise.all(saveOptionPromises);

      return await this.betGroupRepository.findOne({
        where: {
          id: betGroup.id,
        },
        relations: ['betOptions'],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOpenBetGroupForStreamer(data: {
    twitchUsername: string;
  }): Promise<BetGroupEntity> {
    const { twitchUsername } = data;
    return await this.betGroupRepository.findOne({
      where: {
        twitchUsername: twitchUsername,
        active: true,
      },
      relations: ['betOptions'],
    });
  }
  async getBetGroupById(id: string): Promise<BetGroupEntity> {
    return await this.betGroupRepository.findOne({
      where: {
        id,
      },
    });
  }

  async closeBetGroup(data: { betGroupId: string }): Promise<string> {
    const { betGroupId } = data;
    await this.betGroupRepository.update(
      { id: betGroupId.toString() },
      {
        active: false,
      },
    );
    return betGroupId;
  }

  async getBetGroups(): Promise<BetGroupEntity[]> {
    return await this.betGroupRepository.find();
  }

  async resolveBetsByBetGroup(
    betGroupId: { id: string },
    result: IndividualBetResultEntity[],
  ): Promise<BetGroupEntity> {
    const { id } = betGroupId;
    const betGroup = await this.betGroupRepository.findOne({
      where: {
        id: id,
      },
      relations: ['betOptions'],
    });
    if (betGroup) {
      const bets = await this.betService.getBetsByBetGroup(id);
      const resolvedBetPromises = bets.map(async (bet) => {
        await this.betService.resolveBet(bet.id, result, betGroup);
      });

      Promise.all(resolvedBetPromises);
    }
    return await this.betGroupRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
