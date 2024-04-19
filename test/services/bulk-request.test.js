const assert = require('assert');
const app = require('../../backend/app');

describe('\'bulk request\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/bulk-request');

    assert.ok(service, 'Registered the service');
  });
});
