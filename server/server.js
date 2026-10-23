const app = require('./src/app');
const config = require('./src/config/env');
const { bootstrapAdmin } = require('./src/scripts/bootstrapAdmin');

const PORT = config.port || 5000;

app.listen(PORT, async () => {
  console.log(`[Visa Prep Server] Running on http://localhost:${PORT}`);
  console.log(`[Environment] ${config.nodeEnv} | Local Mock: ${config.useLocalMock}`);

  if (config.useLocalMock) {
    try {
      await bootstrapAdmin();
      console.log('[Visa Prep Server] Default admin ready (admin@visaprep.internal / AdminVisaPrep2026!)');
    } catch (e) {
      // Ignore if already initialized
    }
  }
});
