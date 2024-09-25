// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const executeFlow = sequelizeClient.define('execute_flow', {
    periodo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ceco: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutaArchivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nuevaRevision: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  executeFlow.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    executeFlow.belongsTo(models.users);

    executeFlow.hasMany(models.logs_procesos);
  };

  return executeFlow;
};
