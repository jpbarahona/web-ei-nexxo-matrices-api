const { Op } = require("sequelize");
const hydrate = require('feathers-sequelize/hooks/hydrate');
const { orderBy, upperFirst, deburr } = require('lodash')
const moment = require('moment');
const mime = require('mime-types');

module.exports = {
	// get employee associated to the user request
	include: (options = {}) => 
	{
		return async function (context) {
			
			const { app } = context;

			const sequelize = app.get('sequelizeClient');

			const { centro_costos } = sequelize.models;

			var association = {
				include: [
					{
						model: centro_costos,
						through: { attributes: [] }
					}
				],
			};

			switch (context.type) {
				case 'before':
					  context.params.sequelize = Object.assign(association, { raw: false });
					  return Promise.resolve(context);          
					  break;
	
				case 'after':
					  hydrate( association ).call(this, context);          
					  break;
				}
	    }
	},

	createUserCentroCosto: (options = {}) =>
	{
		return async function (context) {
			
			const { app } = context;

			const sequelize = app.get('sequelizeClient');

			const { usuario_centro_costo, centro_costos } = sequelize.models;

			const { data } = context;

			const { id } = context.result;

			if(data.centro_costos.length > 0)
			{

				const idCentroCostos = (await centro_costos.findAll({
					where: {
						nombre: {
							[Op.in]: data.centro_costos
						}
					}
				})).map( item => item.id )

				const usersCentroCostos = idCentroCostos.map( ceco => ({ 
					userId: id,
					centroCostoId: ceco
				}) );

				try{
					// necesito un script sql para insertar datos en tabla usuario_centro_costo
					async function insertUsuarioCentroCostos(userId, centroCostoId) {
						const createdAt = new Date();  // La fecha actual
						const updatedAt = new Date();  // La fecha actual
					  
						const sql = `
						  INSERT INTO usuario_centro_costos (userId, centroCostoId, createdAt, updatedAt)
						  VALUES (:userId, :centroCostoId, :createdAt, :updatedAt);
						`;
					  
						try {
						  await sequelize.query(sql, {
							replacements: { userId, centroCostoId, createdAt, updatedAt },
							type: sequelize.QueryTypes.INSERT,
						  });
						  console.log('Registro insertado con éxito');
						} catch (error) {
						  console.error('Error al insertar el registro:', error);
						}
					  }

					  usersCentroCostos.forEach( async (item) => {
						await insertUsuarioCentroCostos(item.userId, item.centroCostoId);
					  });


				} catch(error) {
					console.log(error);
				}

			}

			return context;
		}
	}		
}