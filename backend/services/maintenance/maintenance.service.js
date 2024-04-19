// Initializes the `test` service on path `/api/maintenance`
const { Maintenance } = require('./maintenance.class');
const createModel = require('../../models/maintenance.model');
const hooks = require('./maintenance.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/maintenance', new Maintenance(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/maintenance');

  service.hooks(hooks);
};