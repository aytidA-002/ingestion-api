const express = require('express');
const { submitIngestion, getIngestionStatus } = require('./ingestionManager');

const app = express();
app.use(express.json());

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || !['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const ingestion_id = submitIngestion({ ids, priority });
  res.json({ ingestion_id });
});

app.get('/status/:ingestion_id', (req, res) => {
  const status = getIngestionStatus(req.params.ingestion_id);
  if (!status) return res.status(404).json({ error: 'Not found' });
  res.json(status);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
