const Bull = require('bull');
const Ulid = require('ulid');

const queue = new Bull('brokers-money-avaliable');

const job = {
  clientId: 1,
};

queue.add(
    'process',
    job,
    {
      removeOnComplete: 100,
      attempts: 1,
      backoff: 5000,
      jobId: Ulid.ulid(),
    },
).then(() => {
  queue.close();
  console.log('single job');
  process.exit();
});
