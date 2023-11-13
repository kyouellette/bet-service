import { BetOptionsEntity } from '../../bet-group/entities/bet-options.entity';

export class CreateBetGroupDTO {
  twitchUsername: string;

  betOptions: BetOptionsEntity[];
}
