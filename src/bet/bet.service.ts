import { Injectable } from '@nestjs/common';
import { BetEntity } from './entities/bet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IndividualBetResultEntity } from '../bet-group/entities/individual-bet-result';
import { CreateBetDTO } from './dto/create-bet.dto';
import { IndividualBetEntity } from './entities/individual-bet';
import { BetGroupEntity } from 'src/bet-group/entities/bet-group.entity';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(BetEntity)
    private readonly betRepository: Repository<BetEntity>,
    @InjectRepository(IndividualBetEntity)
    private readonly invidiualBetRepository: Repository<IndividualBetEntity>,
    private readonly walletService: WalletService,
  ) {}

  async createBet(bet: CreateBetDTO): Promise<BetEntity> {
    let savedBet: BetEntity;

    try {
      // Attempt to create the bet
      savedBet = await this.betRepository.save({
        userId: bet.userId,
        twitchUsername: bet.twitchUsername,
        betGroupId: bet.betGroupId,
        gameTitle: bet.gameTitle,
        totalBetAmount: bet.totalBetAmount,
        status: 'Pending',
        winnings: '0.00',
      });

      const saveIndividualBetsPromises = bet.betsPlaced.map(
        async (individualBet) => {
          await this.invidiualBetRepository.save({
            ...individualBet,
            betId: savedBet.id,
            won: false,
          });
        },
      );

      await Promise.all(saveIndividualBetsPromises);
      this.walletService
        .createTransaction(bet.userId, bet.totalBetAmount, 'spend')
        .subscribe(
          () => console.log(`Bet Placed. ID: ${savedBet.id}`),
          (error) => console.error('Error creating transaction:', error),
        );
    } catch (error) {
      console.error('Error creating bet or transaction:', error);

      if (savedBet) {
        await this.betRepository.remove(savedBet);
      }
      throw error;
    }

    return await this.betRepository.findOne({
      where: {
        id: savedBet.id,
      },
      relations: ['betsPlaced'],
    });
  }

  async getBetsByUserId(id: { id: string }): Promise<BetEntity[]> {
    const userId = id.id;
    return await this.betRepository.find({
      where: {
        userId: userId,
      },
      relations: ['betsPlaced'],
    });
  }

  async getBetsByBetGroup(id: string): Promise<BetEntity[]> {
    return await this.betRepository.find({
      where: {
        betGroupId: id,
      },
      relations: ['betsPlaced'],
    });
  }

  async resolveBet(
    id: string,
    result: IndividualBetResultEntity[],
    betGroup: BetGroupEntity,
  ): Promise<BetEntity> {
    const bet = await this.betRepository.findOne({
      where: {
        id: id,
      },
      relations: ['betsPlaced'],
    });

    if (bet.status !== 'Pending') {
      return bet;
    }

    let winMultipler = 0;
    const updatedBetPromises = bet.betsPlaced.map(async (individualBet) => {
      const streamerResult = result.find(
        (result) => result.category === individualBet.category,
      );
      if (streamerResult.value >= individualBet.value) {
        const betOption = betGroup.betOptions.find(
          (option) =>
            option.category === individualBet.category &&
            option.value === individualBet.value,
        );
        winMultipler += betOption?.payoutMultiplier;
        await this.invidiualBetRepository.update(
          { id: individualBet.id },
          {
            won: true,
          },
        );
      }
    });

    await Promise.all(updatedBetPromises);

    const wonValueNumber = parseFloat(bet.totalBetAmount) * winMultipler;
    const wonValueString = wonValueNumber.toFixed(2);

    if (wonValueNumber > 0) {
      try {
        this.walletService
          .createTransaction(bet.userId, wonValueString, 'add')
          .subscribe(
            () => console.log(`Bet Paid ID: ${bet.id}`),
            (error) => console.error('Error creating transaction:', error),
          );
      } catch (error) {
        console.log('Error adding funds for user:', bet.userId);
      }
    }

    const totalBetNumber = parseFloat(bet.totalBetAmount);

    await this.betRepository.update(
      { id },
      {
        winnings: wonValueString,
        status: wonValueNumber > totalBetNumber ? 'Won' : 'Lost',
      },
    );
    const updatedBet = await this.betRepository.findOne({
      where: {
        id,
      },
    });
    return updatedBet;
  }
}
