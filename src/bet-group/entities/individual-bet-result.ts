import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('individual-bet-result')
export class IndividualBetResultEntity extends BaseEntity {
  @Column()
  category: string;

  @Column()
  value: number;
}
