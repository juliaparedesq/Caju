// Initializes the `test` service on path `/api/equipment`
const { Equipment } = require('./equipment.class');
const createModel = require('../../models/equipment.model');
const hooks = require('./equipment.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/equipment', new Equipment(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/equipment');

  service.hooks(hooks);
};
