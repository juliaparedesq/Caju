const assert = require('assert');
const app = require('../../backend/app');

describe('\'surgery\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/surgery');

    assert.ok(service, 'Registered the service');
  });
});
