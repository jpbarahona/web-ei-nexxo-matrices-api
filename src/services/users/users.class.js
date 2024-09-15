const { Service } = require('feathers-sequelize');

exports.Users = class Users extends Service {
  
    create(data, params) {
        // This is the information we want from the user signup data
        const { email, rol } = data;
        // Use the existing `data` object from the hook or create an empty object
        data = { email, rol };
        // Call the original `create` method with existing `data` and original `params`
        return super.create({
            email,
            password: '123456789',
            rol
        }, params);
    }

};
