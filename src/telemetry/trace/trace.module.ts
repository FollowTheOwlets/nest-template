import { Global, Module } from '@nestjs/common';
import { TraceService } from './trace.service';

@Global()
@Module({
    providers: [TraceService],
    exports: [TraceService],
})
export class TraceModule {}
