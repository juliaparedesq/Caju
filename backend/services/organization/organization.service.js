// Initializes the `test` service on path `/api/organization`
const { Organization } = require('./organization.class');
const createModel = require('../../models/organization.model');
const hooks = require('./organization.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/organization', new Organization(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/organization');

  service.hooks(hooks);
};
