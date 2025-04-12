import { readFile } from 'node:fs/promises';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecureService {
  private _cert?: Promise<string>;

  constructor(private readonly configService: ConfigService) {}

  get cert(): Promise<string> {
    return (this._cert ??= this.loadCert());
  }

  private loadCert(): Promise<string> {
    return readFile(this.configService.getOrThrow<string>('service.auth.certPath'), 'utf-8');
  }
}
