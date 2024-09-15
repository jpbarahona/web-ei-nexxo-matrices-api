// Initializes the `execute-flow` service on path `/execute-flow`
const { ExecuteFlow } = require('./execute-flow.class');
const createModel = require('../../models/execute-flow.model');
const hooks = require('./execute-flow.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/execute-flow', new ExecuteFlow(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('execute-flow');

  service.hooks(hooks);
};
