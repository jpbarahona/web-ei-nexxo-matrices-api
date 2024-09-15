// Initializes the `cargos` service on path `/cargos`
const { Cargos } = require('./cargos.class');
const createModel = require('../../models/cargos.model');
const hooks = require('./cargos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cargos', new Cargos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cargos');

  service.hooks(hooks);
};
