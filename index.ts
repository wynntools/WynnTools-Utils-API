import { loadEndpoints } from './src/loadEndpoints';
import { otherMessage } from './src/logger';
import { api } from './config.json';
import express from 'express';
import { join } from 'path';

const app = express();

try {
  app.get('/', async (req: any, res: any) => {
    return res.redirect('https://stackoverflow.com/questions/36316118/typescript-dirname-value');
  });

  const endpointsDir = join(__dirname, 'src', 'endpoints');
  const result = loadEndpoints(endpointsDir, app);
  if (result !== undefined) {
    otherMessage(`Loaded ${result.loaded} endpoints, skipped ${result.skipped} endpoints`);
  } else {
    otherMessage(`No endpoints found in ${endpointsDir}`);
  }

  app.listen(api.PORT, () => {
    otherMessage(`Server started on port ${api.PORT} @ http://localhost:${api.PORT}`);
  });
} catch (error: any) {
  otherMessage(`Error starting server: ${error}`);
}
