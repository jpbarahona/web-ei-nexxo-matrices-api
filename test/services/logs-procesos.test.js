const assert = require('assert');
const app = require('../../src/app');

describe('\'logs-procesos\' service', () => {
  it('registered the service', () => {
    const service = app.service('logs-procesos');

    assert.ok(service, 'Registered the service');
  });
});
