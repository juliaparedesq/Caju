const assert = require('assert');
const app = require('../../backend/app');

describe('\'prediction\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/prediction');

    assert.ok(service, 'Registered the service');
  });
});
