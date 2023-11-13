import { BetOptionsEntity } from '../entities/bet-options.entity';

export class CreateBetGroupDTO {
  twitchUsername: string;

  betOptions: BetOptionsEntity[];
}
