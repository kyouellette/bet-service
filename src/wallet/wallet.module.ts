import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WalletService } from './wallet.service';

@Module({
  imports: [HttpModule],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
