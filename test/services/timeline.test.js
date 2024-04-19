const assert = require('assert');
const app = require('../../backend/app');

describe('\'timeline\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/timeline');

    assert.ok(service, 'Registered the service');
  });
});
