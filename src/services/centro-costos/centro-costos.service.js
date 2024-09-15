// Initializes the `centro-costos` service on path `/centro-costos`
const { centroCostos } = require('./centro-costos.class');
const createModel = require('../../models/centro-costos.model');
const hooks = require('./centro-costos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/centro-costos', new centroCostos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('centro-costos');

  service.hooks(hooks);
};
