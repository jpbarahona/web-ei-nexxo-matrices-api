const { authenticate } = require('@feathersjs/authentication').hooks;
const { include } = require('./execute-flow.modules');

module.exports = {
  before: {
    all: [ authenticate('jwt')],
    find: [
      include()
    ],
    get: [],
    create: [],
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
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
