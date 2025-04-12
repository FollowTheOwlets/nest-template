import { TraceService } from '~src/telemetry/trace/trace.service';

export default (traceService: TraceService, metadata: Record<string, unknown>) => {
  if (!metadata['x-request-id']) return;
  const rqId = metadata['x-request-id'] as string;

  const httpSpan = traceService.takeHttpSpan(rqId);

  if (httpSpan) {
    httpSpan.setAttribute('x-request-id', rqId);
    traceService.traceIncomingRequest(
      {
        'x-request-id': rqId,
        headers: metadata.headers,
        query: metadata.query,
        params: metadata.params,
        url: metadata.url || '',
        method: metadata.method || '',
        body: metadata.body
      },
      httpSpan
    );
  }
};
