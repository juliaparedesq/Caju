const assert = require('assert');
const app = require('../../backend/app');

describe('\'prediction results\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/prediction-results');

    assert.ok(service, 'Registered the service');
  });
});
