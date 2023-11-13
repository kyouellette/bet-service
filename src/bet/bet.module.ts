import { Module } from '@nestjs/common';
import { BetController } from './bet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetEntity } from './entities/bet.entity';
import { BetService } from './bet.service';
import { IndividualBetEntity } from './entities/individual-bet';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BetEntity, IndividualBetEntity]),
    WalletModule,
  ],
  providers: [BetService],
  controllers: [BetController],
  exports: [BetService],
})
export class BetModule {}
