const assert = require('assert');
const app = require('../../src/app');

describe('\'cargos\' service', () => {
  it('registered the service', () => {
    const service = app.service('cargos');

    assert.ok(service, 'Registered the service');
  });
});
