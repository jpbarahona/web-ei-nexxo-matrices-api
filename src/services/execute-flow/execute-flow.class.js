const { Service } = require('feathers-sequelize');
const axios = require('axios');


exports.ExecuteFlow = class ExecuteFlow extends Service {
  
    create (data, params) {
        axios.post('https://prod-06.eastus.logic.azure.com:443/workflows/e47ae2c4ac524232af167cbea7e53d1b/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=RSsY7D8OCLC9cSQCAae0IVpeoQNkyhzFG8M1Msx95NQ', data)
        return super.create(data, params);
    }

};
