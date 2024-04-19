const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const checkSameUser = require('../../hooks/check-same-user');
const restrictToRole = require('../../hooks/restrict-to-role');
const sequelizeInclude = require('../../hooks/sequelize-include');

module.exports = {
  before: {
    all: [ ],
    find: [ authenticate('jwt'), restrictToRole(["admin"]) ],
    get: [ authenticate('jwt'), checkSameUser() ],
    create: [ hashPassword('password') ],
    update: [ authenticate('jwt'), hashPassword('password'), restrictToRole(["admin"]) ],
    patch: [ authenticate('jwt'), hashPassword('password'), restrictToRole(["admin"]) ],
    remove: [ authenticate('jwt'), restrictToRole(["admin"]) ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
