import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../bet-group/entities/base.entity';
import { IndividualBetEntity } from './individual-bet';

@Entity('bet')
export class BetEntity extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  twitchUsername: string;

  @Column()
  betGroupId: string;

  @Column()
  gameTitle: string;

  @Column()
  totalBetAmount: string;

  @Column({ nullable: true })
  winnings: string;

  @Column()
  status: string;

  @OneToMany(() => IndividualBetEntity, (individualBet) => individualBet.bet)
  @JoinColumn({ name: 'betId', referencedColumnName: 'id' })
  betsPlaced: IndividualBetEntity[];

  constructor(data?: Partial<BetEntity>) {
    super(); // Call the base class constructor

    this.userId = data?.userId;
    this.twitchUsername = data?.twitchUsername;
    this.betGroupId = data?.betGroupId;
    this.gameTitle = data?.gameTitle;
    this.totalBetAmount = data?.totalBetAmount;
    this.winnings = data?.winnings;
    this.status = data?.status;
  }
}
