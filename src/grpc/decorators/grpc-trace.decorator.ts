import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { TRACERS } from '~src/telemetry/trace/const/const';

export const GRPCTrace = (name: string) =>
    Trace(`gRPC ${name}`, { logInput: true, logOutput: true }, TRACERS.GRPC, {
        root: true,
    });
