import { withFixNodeFileTrace as _withFixNodeFileTrace } from '@ritzjs/core/server';

function HealthCheck(_req, res) {
  res.status(200).send('ok');
}

export default _withFixNodeFileTrace(HealthCheck);
