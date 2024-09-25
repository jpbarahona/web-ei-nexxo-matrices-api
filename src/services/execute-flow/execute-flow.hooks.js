const { authenticate } = require('@feathersjs/authentication').hooks;
const { include, postCreateExecuteFlow } = require('./execute-flow.modules');

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
    create: [
      postCreateExecuteFlow()
    ],
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
