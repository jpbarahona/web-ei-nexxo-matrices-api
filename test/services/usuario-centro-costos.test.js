const assert = require('assert');
const app = require('../../src/app');

describe('\'usuario-centro-costos\' service', () => {
  it('registered the service', () => {
    const service = app.service('usuario-centro-costos');

    assert.ok(service, 'Registered the service');
  });
});
