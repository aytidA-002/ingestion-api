const { v4: uuidv4 } = require('uuid');
const { sleep } = require('./utils');
const { enqueueRequest, getNextBatch } = require('./queues');

const ingestionStore = new Map(); // ingestion_id -> data
const BATCH_INTERVAL = 5000; // 5 seconds

// Schedule batch processor
setInterval(async () => {
  const request = getNextBatch();
  if (!request) return;

  const { ingestion_id, batches } = ingestionStore.get(request.ingestion_id);

  for (const batch of batches) {
    if (batch.status === 'yet_to_start') {
      batch.status = 'triggered';

      // Simulate async processing
      await sleep(2000);
      batch.status = 'completed';
      console.log(`Processed batch ${batch.batch_id}:`, batch.ids);
      break; // Only one batch per 5s interval
    }
  }
}, BATCH_INTERVAL);

function submitIngestion({ ids, priority }) {
  const ingestion_id = uuidv4();
  const created_time = Date.now();

  // Split into batches of 3
  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    batches.push({
      batch_id: uuidv4(),
      ids: ids.slice(i, i + 3),
      status: 'yet_to_start'
    });
  }

  ingestionStore.set(ingestion_id, {
    ingestion_id,
    priority,
    created_time,
    status: 'yet_to_start',
    batches
  });

  enqueueRequest({ ingestion_id, priority, created_time });
  return ingestion_id;
}

function getIngestionStatus(ingestion_id) {
  const record = ingestionStore.get(ingestion_id);
  if (!record) return null;

  const statuses = record.batches.map(b => b.status);
  const outerStatus = statuses.every(s => s === 'yet_to_start')
    ? 'yet_to_start'
    : statuses.every(s => s === 'completed')
    ? 'completed'
    : 'triggered';

  return {
    ingestion_id,
    status: outerStatus,
    batches: record.batches
  };
}

module.exports = { submitIngestion, getIngestionStatus };
