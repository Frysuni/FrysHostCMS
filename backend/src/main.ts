import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import envConfig from '@env';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { ExceptionsFilter } from '@system/apiException';
import appRegistrations from '@system/appRegistrations';
import validationPipe from '@system/validationPipe';
import { resolve } from 'path';
import { NestCoreLogger } from './api/logger.service';

const ASCII_ART = '\n\n\x1b[35m______               _   _           _\n|  ___|             | | | |         | |\n| |_ _ __ _   _ ___ | |_| | ___  ___| |_\n|  _| \'__| | | / __||  _  |/ _ \\/ __| __|\n| | | |  | |_| \\__ \\| | | | (_) \\__ \\ |_\n\\_| |_|   \\__, |___/\\_| |_/\\___/|___/\\__|\n           __/ |\n          |___/\x1b[0m\n\n';

void async function bootstrap() {
  if (!envConfig.devMode) {
    process.stdout.write(ASCII_ART);
    await new Promise(res => setTimeout(res, 500));
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new NestCoreLogger,
      bufferLogs: true,
    },
  );

  await appRegistrations(app);

  if (envConfig.apiUrl.origin !== envConfig.baseUrl.origin) {
    app.enableCors({ credentials: true, origin: true });
  }
  if (envConfig.assetsAutoRouting) {
    app.useStaticAssets({
      root: resolve(__dirname, '../', 'assets'),
      prefix: '/assets',
    });
  }

  app.enableShutdownHooks();

  app.useGlobalFilters(new ExceptionsFilter);
  app.useGlobalPipes(validationPipe);
  app.setGlobalPrefix(envConfig.apiUrl.pathname);

  return app.listen(envConfig.port, envConfig.apiUrl.hostname);
}();