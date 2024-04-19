// Initializes the `agreement` service on path `/api/agreement`
const { Agreement } = require('./agreement.class');
const createModel = require('../../models/agreement.model');
const hooks = require('./agreement.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/agreement', new Agreement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/agreement');

  service.hooks(hooks);
};
