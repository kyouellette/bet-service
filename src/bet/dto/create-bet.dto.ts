import { CreateIndividualBetDTO } from './create-individual-bet.dto';

export class CreateBetDTO {
  userId: string;

  twitchUsername: string;

  betGroupId: string;

  gameTitle: string;

  totalBetAmount: string;

  betsPlaced: CreateIndividualBetDTO[];
}
