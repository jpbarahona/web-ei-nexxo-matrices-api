require('dotenv').config();
const msal = require('@azure/msal-node');
const {
  CLIENT_SECRET,
  CLIENT_ID,
  TENANT_ID
} = process.env;

// Configuración de MSAL
const config = {
  auth: {
    clientId: CLIENT_ID,
    authority: 'https://login.microsoftonline.com/'+TENANT_ID,
    clientSecret: CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        // console.log(message);
      },
      piiLoggingEnabled: false,
      // logLevel: msal.LogLevel.Verbose,
    },
  },
};

const pca = new msal.ConfidentialClientApplication(config);

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
    // Ruta para iniciar sesión
    app.get('/login', (req, res) => {
      const authUrlParams = {
        scopes: ['user.read'],
        redirectUri: 'http://localhost:3030/redirect',
      };

      pca.getAuthCodeUrl(authUrlParams).then((response) => {
        res.redirect(response);
      }).catch((error) => console.log(JSON.stringify(error)));
    });

    // Ruta de redirección para manejar el token
    app.get('/redirect', (req, res) => {
      const tokenRequest = {
        code: req.query.code,
        token: req.query.accessToken,
        scopes: ['user.read'],
        redirectUri: 'http://localhost:3030/redirect',
      };

      pca.acquireTokenByCode(tokenRequest).then(async (response) => {
        // res.send({accessToken: response.accessToken});
        // console.log("Token adquirido: ", response.accessToken);

        let password = CLIENT_SECRET+response.account.username

        let authRequest = {
          strategy: 'local',
          email: response.account.username,
          password,
        };

        // 1. validar si existe usuario
        app.service('users').find({
          query: {
            email: response.account.username,
          },
        }).then(async (users) => {
          if (users.total > 0) {
            
            await app.service('users').patch(users.data[0].id, {
              password
            });

            let authRes = await app.service('authentication').create(authRequest,{});
            res.redirect(301, `http://localhost:3033/app?code=${authRes.accessToken}`);
            
            return;
          } else {

          // 2. Crear usuario
          app.service('users').create({
            email: response.account.username,
            password,
          }).then(async (user) => {
            // console.log("Usuario creado: ", user);
            let authRes = await app.service('authentication').create(authRequest,{});
            res.redirect(301, `http://localhost:3033/app?code=${authRes.accessToken}`);

          }).catch((error) => console.log());
          }
        }).catch((error) => console.log());


      }).catch((error) => console.log());
    });
};
