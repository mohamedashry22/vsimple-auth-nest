import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';
import { Request, Response } from 'express';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = process.hrtime.bigint();
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const durationSec = Number(process.hrtime.bigint() - start) / 1_000_000_000;
        const route = (req.route?.path ?? req.path) || 'unknown';
        const labels = { method: req.method, route, status: String(res.statusCode) };
        this.metrics.httpRequestsTotal.inc(labels, 1);
        this.metrics.httpRequestDurationSeconds.observe(labels, durationSec);
      }),
    );
  }
}
