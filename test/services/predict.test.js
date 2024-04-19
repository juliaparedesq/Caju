const assert = require('assert');
const app = require('../../backend/app');

describe('\'predict\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/predict');

    assert.ok(service, 'Registered the service');
  });
});
