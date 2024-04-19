const assert = require('assert');
const app = require('../../backend/app');

describe('\'report\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/report');

    assert.ok(service, 'Registered the service');
  });
});
