const assert = require('assert');
const app = require('../../backend/app');

describe('\'request\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/request');

    assert.ok(service, 'Registered the service');
  });
});
