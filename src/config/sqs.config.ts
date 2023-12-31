import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('sqs', () => ({
  consumer: {
    queues: {
      aggregate: 'stat-keeper_aggregate',
      aggregateQueueUrl:
        'https://sqs.us-east-1.amazonaws.com/076754174573/example-queue',
    },
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY || '',
    },
  },
  producer: {
    queues: {
      aggregate: 'stat-keeper_aggregate',
      aggregateQueueUrl:
        'https://sqs.us-east-1.amazonaws.com/076754174573/example-queue',
    },
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/076754174573/example-queue',
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY || '',
    },
  },
}));
