import { processSteps } from './dist/index.js'; // adjust path if needed

processSteps({
  all: true,
  force: true,
  verbose: true
});

// Generate Page Objects and Specs from .stepMap.json

import { processTests } from './dist/index.js';

processTests({
  all: true,
  force: true,
  verbose: true
});
