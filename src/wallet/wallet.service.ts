// wallet.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class WalletService {
  constructor(private httpService: HttpService) {}

  private walletServiceUrl = 'http://localhost:3001/api/wallet';

  createTransaction(
    userId: string,
    amount: string,
    type: string,
  ): Observable<AxiosResponse<number>> {
    const data = {
      userId,
      amount,
      type,
    };

    return this.httpService.post<number>(
      `${this.walletServiceUrl}/transaction/create`,
      data,
    );
  }
}
