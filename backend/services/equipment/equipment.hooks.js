const { authenticate } = require('@feathersjs/authentication').hooks;

const filterByCostMaintenances = require('../../hooks/filter-by-cost-maintenances');
const roleEquipment = require('../../hooks/role-equipment');
const roleListEquipments = require('../../hooks/role-list-equipments');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [filterByCostMaintenances(), roleListEquipments()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [roleEquipment()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
