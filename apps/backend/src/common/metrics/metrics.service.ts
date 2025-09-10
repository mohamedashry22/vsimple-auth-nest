import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

function parseBuckets(envValue: string | undefined, fallback: number[]): number[] {
  if (!envValue) return fallback;
  const nums = envValue.split(',').map(v => Number(v.trim())).filter(v => !Number.isNaN(v) && v > 0);
  return nums.length ? nums : fallback;
}

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  readonly httpRequestsTotal: Counter<'method' | 'route' | 'status'>;
  readonly httpRequestDurationSeconds: Histogram<'method' | 'route' | 'status'>;

  constructor() {
    const service = process.env.SERVICE_NAME ?? 'auth-backend';
    this.registry.setDefaultLabels({ service });

    const enabled = String(process.env.METRICS_ENABLED ?? 'true') === 'true';
    if (enabled) collectDefaultMetrics({ register: this.registry });

    const buckets = parseBuckets(process.env.METRICS_DEFAULT_BUCKETS, [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]);

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'HTTP request count',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDurationSeconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request latency (s)',
      buckets,
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });
  }

  metrics(): Promise<string> {
    return this.registry.metrics();
  }
}
