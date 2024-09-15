const Sequelize = require('sequelize');
const { SQL_DATABASE, SQL_USER, SQL_PASSWORD, SQL_HOST } = process.env;

module.exports = function (app) {
  const connectionString = app.get('mssql');
  const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASSWORD,{
    host: SQL_HOST,
    dialect: 'mssql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 1800000,
      acquire: 1800000,
    },
    dialectOptions: {
        options: {
          requestTimeout: 1800000 // Tiempo de espera en milisegundos (30 minutos)
        }
      },
  })
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync({alter: true}));

    return result;
  };
};
