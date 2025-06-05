const { PRIORITY_VALUES } = require('./utils');

const priorityQueues = {
  HIGH: [],
  MEDIUM: [],
  LOW: []
};

function enqueueRequest(request) {
  priorityQueues[request.priority].push(request);
}

function getNextBatch() {
  for (const priority of ['HIGH', 'MEDIUM', 'LOW']) {
    if (priorityQueues[priority].length > 0) {
      return priorityQueues[priority].shift();
    }
  }
  return null;
}

module.exports = { priorityQueues, enqueueRequest, getNextBatch };
