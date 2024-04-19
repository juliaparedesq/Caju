const assert = require('assert');
const app = require('../../backend/app');

describe('\'indicators\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/indicators');

    assert.ok(service, 'Registered the service');
  });
});
