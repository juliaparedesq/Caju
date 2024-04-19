const assert = require('assert');
const app = require('../../backend/app');

describe('\'staging tree\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/staging-tree');

    assert.ok(service, 'Registered the service');
  });
});
