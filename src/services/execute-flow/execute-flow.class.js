const { Service } = require('feathers-sequelize');
const axios = require('axios');


exports.ExecuteFlow = class ExecuteFlow extends Service {
  
    create (data, params) {
        
        const body = {
            ...data,
            userId: params.user.id,
            estado: 'Pendiente'
        }

        delete body.procesos;

        return super.create(body, params);
    }

};
