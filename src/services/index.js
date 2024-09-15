const users = require('./users/users.service.js');
const centroCostos = require('./centro-costos/centro-costos.service.js');
const logsProcesos = require('./logs-procesos/logs-procesos.service.js');
const categorias = require('./categorias/categorias.service.js');
const cargos = require('./cargos/cargos.service.js');
const executeFlow = require('./execute-flow/execute-flow.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(centroCostos);
  app.configure(logsProcesos);
  app.configure(categorias);
  app.configure(cargos);
  app.configure(executeFlow);
};
