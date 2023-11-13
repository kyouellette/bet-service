import { IndividualBetEntity } from '../../bet/entities/individual-bet';

export class CreateBetDTO {
  userId: string;

  twitchUsername: string;

  betGroupId: string;

  gameTitle: string;

  totalBetAmount: string;

  betsPlaced: IndividualBetEntity[];
}
