import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BetGroupEntity } from './bet-group.entity';

@Entity('bet-options')
export class BetOptionsEntity extends BaseEntity {
  @Column()
  betGroupId: string;

  @Column()
  category: string;

  @Column()
  value: number;

  @Column()
  payoutMultiplier: number;

  @ManyToOne(() => BetGroupEntity, (betGroup) => betGroup.betOptions)
  betGroup: BetGroupEntity;
}
