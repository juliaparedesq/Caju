// Initializes the `test` service on path `/api/equipmentType`
const { EquipmentType } = require('./equipmentType.class');
const createModel = require('../../models/equipmentType.model');
const hooks = require('./equipmentType.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/equipmentType', new EquipmentType(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/equipmentType');

  service.hooks(hooks);
};
