// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const logsProcesos = sequelizeClient.define('logs_procesos', {
    proceso: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estado: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rutaArchivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  logsProcesos.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    logsProcesos.belongsTo(models.execute_flow);
  };

  return logsProcesos;
};
