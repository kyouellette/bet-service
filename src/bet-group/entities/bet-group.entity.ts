import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BetOptionsEntity } from './bet-options.entity';

@Entity('bet-group')
export class BetGroupEntity extends BaseEntity {
  @Column()
  twitchUsername: string;

  @Column()
  active: boolean;

  @OneToMany(() => BetOptionsEntity, (option) => option.betGroup)
  @JoinColumn({ name: 'betGroupId', referencedColumnName: 'id' })
  betOptions: BetOptionsEntity[];
}
