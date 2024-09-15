// Initializes the `logs-procesos` service on path `/logs-procesos`
const { LogsProcesos } = require('./logs-procesos.class');
const createModel = require('../../models/logs-procesos.model');
const hooks = require('./logs-procesos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/logs-procesos', new LogsProcesos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('logs-procesos');

  service.hooks(hooks);
};
