import { serve } from '@hono/node-server';
import { Queue, Worker } from 'bullmq';
import { Hono } from 'hono';
import redisConnection from './redis';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('/api/*', cors());
app.use(logger());

const queue = new Queue('scrape-queue', {
  connection: redisConnection
});

app.post('/api/queue', async (c) => {
  const { keywords } = await c.req.json<{ keywords: string[] }>();

  if (!keywords || !Array.isArray(keywords)) {
    return c.json({ status: 'error', message: 'Invalid keywords' });
  }

  const job = await queue.add('process-data', { keywords: keywords });
  return c.json({ status: 'ok', job_id: job.id });
});

app.get('/api/queue/:id', async (c) => {
  const id = c.req.param('id');
  const job = await queue.getJob(id);
  if (!job) {
    return c.json({ status: 'error', message: 'Job not found' });
  }

  return c.json({ status: await job.getState(), job_id: job.id });
});

const worker = new Worker(
  'scrape-queue',
  async (job) => {
    if (job.name === 'process-data') {
      console.log('Processing data', job.data.keywords);
    }
  },
  { connection: redisConnection }
);

worker.on('error', (err) => {
  console.error(err);
});

const port = process.env.HONO_API_PORT ? parseInt(process.env.HONO_API_PORT) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
