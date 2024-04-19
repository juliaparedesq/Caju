// Initializes the `test` service on path `/api/provider`
const { Provider } = require('./provider.class');
const createModel = require('../../models/provider.model');
const hooks = require('./provider.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/provider', new Provider(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/provider');

  service.hooks(hooks);
};
