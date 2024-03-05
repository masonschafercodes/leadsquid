import { serve } from '@hono/node-server';
import { Queue, Worker } from 'bullmq';
import { Hono } from 'hono';
import redisConnection from './redis';

const app = new Hono();

const queue = new Queue('test-queue', {
  connection: redisConnection
});

app.get('/', async (c) => {
  const job = await queue.add('process-data', { keywords: ['testing', 'testing2', 'testin3'] });
  return c.json({ status: 'ok', job_id: job.id });
});

app.get('/check/:id', async (c) => {
  const id = c.req.param('id');
  const job = await queue.getJob(id);
  if (!job) {
    return c.json({ status: 'error', message: 'Job not found' });
  }

  return c.json({ status: await job.getState(), job_id: job.id });
});

const worker = new Worker(
  'test-queue',
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

const port = process.env.HONO_API_PORT ? parseInt(process.env.HONO_API_PORT) : 5000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
