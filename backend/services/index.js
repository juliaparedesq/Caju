const equipment = require('./equipment/equipment.service.js');
const equipmentType = require('./equipmentType/equipmentType.service.js');
const healthService = require('./healthService/healthService.service.js');
const maintenance = require('./maintenance/maintenance.service.js');
const organization = require('./organization/organization.service.js');
const provider = require('./provider/provider.service.js');
const users = require('./users/users.service.js');
const files = require('./files/files.service.js');
const agreement = require('./agreement/agreement.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(equipment);
  app.configure(equipmentType);
  app.configure(healthService);
  app.configure(maintenance);
  app.configure(organization);
  app.configure(provider);
  app.configure(users);
  app.configure(files);
  app.configure(agreement);
}
