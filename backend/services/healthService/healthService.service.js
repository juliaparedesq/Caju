// Initializes the `test` service on path `/api/healthService`
const { HealthService } = require('./healthService.class');
const createModel = require('../../models/healthService.model');
const hooks = require('./healthService.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/healthService', new HealthService(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/healthService');

  service.hooks(hooks);
};
