export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  mongoUri: string;
  jwtSecret: string;
  cookieSecure: boolean;
  corsOrigin: string;
}

export function buildConfig(env: Record<string, string | undefined>): AppConfig {
  return {
    nodeEnv: (env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
    port: Number(env.PORT ?? '3000'),
    mongoUri: env.MONGODB_URI ?? 'mongodb://localhost:27017/authdb',
    jwtSecret: env.JWT_SECRET ?? 'development-secret',
    cookieSecure: String(env.COOKIE_SECURE ?? 'false') === 'true',
    corsOrigin: env.CORS_ORIGIN ?? 'http://localhost:5173',
  };
}
