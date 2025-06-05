# 🚀 Data Ingestion API

This project implements a priority-based, rate-limited data ingestion system using Node.js and Express. It allows clients to submit ingestion jobs containing IDs, which are then processed asynchronously in prioritized batches.

---

## 📦 Features

- 🔁 **Asynchronous Batch Processing** — IDs are processed in groups of 3
- ⏱ **Rate Limit** — Only 1 batch processed every 5 seconds
- 🧠 **Priority Queue** — HIGH > MEDIUM > LOW
- 🧪 **Status Tracking** — View ingestion progress and batch details
- ⚙️ **Test Coverage** — Jest + Supertest-based validation

---

## ⚙️ Technologies

- Node.js
- Express.js
- UUID
- In-memory queues
- Jest + Supertest (for testing)

---

## 📥 API Endpoints

### `POST /ingest`

Submit a new ingestion job.

#### Request:
```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"
}
