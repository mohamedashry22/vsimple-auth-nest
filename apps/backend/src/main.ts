import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor';
import { MetricsService } from './common/metrics/metrics.service';
import { HttpMetricsInterceptor } from './common/interceptors/http-metrics.interceptor';
import { Request, Response } from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());

  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? '900000');
  const max = Number(process.env.RATE_LIMIT_MAX ?? '100');
  app.use(rateLimit({ windowMs, max }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  if (String(process.env.SECURITY_XSS ?? 'true') === 'true') {
    app.useGlobalInterceptors(new SanitizeInterceptor());
  }

  if (String(process.env.METRICS_ENABLED ?? 'true') === 'true') {
    app.useGlobalInterceptors(new HttpMetricsInterceptor(app.get(MetricsService)));
    const path = process.env.METRICS_ROUTE ?? '/metrics';
    app.getHttpAdapter().get(path, async (req: Request, res: Response) => {
      const metrics = app.get(MetricsService);
      res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.send(await metrics.metrics());
    });
  }

  await app.listen(Number(process.env.PORT ?? '3000'));
}
bootstrap();
