import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../bet-group/entities/base.entity';
import { BetEntity } from './bet.entity';

@Entity('individual-bet')
export class IndividualBetEntity extends BaseEntity {
  @Column()
  betId: string;

  @Column()
  category: string;

  @Column()
  value: number;

  @Column()
  won: boolean;

  @ManyToOne(() => BetEntity, (bet) => bet.betsPlaced)
  bet: BetEntity;
}
