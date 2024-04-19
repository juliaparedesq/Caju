const assert = require('assert');
const app = require('../../backend/app');

describe('\'rutas clinicas\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/rutas-clinicas');

    assert.ok(service, 'Registered the service');
  });
});
