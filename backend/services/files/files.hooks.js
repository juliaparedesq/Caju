const { authenticate } = require('@feathersjs/authentication').hooks;

const setFile = require('../../hooks/set-file');

const deleteFile = require('../../hooks/delete-file');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [setFile()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [deleteFile()],
    update: [],
    patch: [],
    remove: []
  }
};
