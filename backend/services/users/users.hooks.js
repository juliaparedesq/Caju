const { authenticate } = require('@feathersjs/authentication').hooks;

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const checkSameUser = require('../../hooks/check-same-user');
const restrictToRole = require('../../hooks/restrict-to-role');
const sequelizeInclude = require('../../hooks/sequelize-include');
const loginUserActive = require('../../hooks/login-user-active');

module.exports = {
  before: {
    all: [ authenticate('jwt'), loginUserActive() ],
    find: [ restrictToRole(["admin"]) ],
    get: [ checkSameUser() ],
    create: [ hashPassword('password'), restrictToRole(["admin"]) ],
    update: [ hashPassword('password'), restrictToRole(["admin"]) ],
    patch: [ hashPassword('password'), restrictToRole(["admin"]) ],
    remove: [ restrictToRole(["admin"]) ]
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
