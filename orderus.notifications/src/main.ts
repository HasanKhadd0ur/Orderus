import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DAPR_SUBSCRIPTIONS } from './dapr/daprSubscribtions.dapr';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const expressApp = express();
  expressApp.use(express.json({ type: ['application/json', 'application/*+json'] }));
  
  expressApp.get('/dapr/subscribe', (req, res) => {
    console.log('Dapr subscription endpoint called');
    const subscriptions = DAPR_SUBSCRIPTIONS;
    console.log('Returning subscriptions:', subscriptions);
    res.json(subscriptions)
  });
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.listen(process.env.SERVICE_APP_PORT || 3001,'0.0.0.0');
}
bootstrap();
