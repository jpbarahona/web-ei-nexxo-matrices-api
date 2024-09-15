const assert = require('assert');
const app = require('../../src/app');

describe('\'execute-flow\' service', () => {
  it('registered the service', () => {
    const service = app.service('execute-flow');

    assert.ok(service, 'Registered the service');
  });
});
