const assert = require('assert');
const app = require('../../backend/app');

describe('\'documents\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/document');

    assert.ok(service, 'Registered the service');
  });
});
