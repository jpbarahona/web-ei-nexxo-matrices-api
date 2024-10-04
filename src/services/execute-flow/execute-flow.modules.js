const hydrate = require('feathers-sequelize/hooks/hydrate');
const axios = require('axios');
const { FUNCTIONAPI } = process.env;

module.exports = {
	// get employee associated to the user request
	include: (options = {}) => 
	{
		return async function (context) {

			var association = {
				order: [['id', 'desc']],
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

	// get execute data for following procesing
	postCreateExecuteFlow: (options = {}) =>
	{
		return async function (context) {
			let { data, result, app } = context;

			let { id } = result;

			data.executeFlowId = id;
			
			const promises = data.procesos.map(async (proceso) => {
				// Crear un log para el proceso
				await app.service('logs-procesos').create({
					estado: "Pendiente",
					executeFlowId: id,
					mensaje: "Proceso iniciado",
					proceso: proceso === 'oc' ? 'Orden de compra' : proceso.charAt(0).toUpperCase() + proceso.slice(1), // Capitaliza la primera letra
					rutaArchivo: ''
				});
			
				// Ejecutar la función asincrónicamente con axios.post
				return axios.post(`${FUNCTIONAPI}/api/${proceso}`, {
					executeFlowId: id,
					periodo: data.periodo,
					ceco: data.ceco,
					nuevaRevision: data.nuevaRevision
				});
			});
			
			// Esperar a que todas las promesas terminen
			Promise.all(promises);

			if(data.procesos.includes('buk')){
				axios.post(`${FUNCTIONAPI}/api/prebuk`, {
					executeFlowId: id,
					periodo: data.periodo,
					ceco: data.ceco,
					nuevaRevision: data.nuevaRevision,
					buk: true
				})
			} else {
				axios.post(`${FUNCTIONAPI}/api/prebuk`, {
					executeFlowId: id,
					periodo: data.periodo,
					ceco: data.ceco,
					nuevaRevision: data.nuevaRevision,
					buk: false
				})
			}



			return Promise.resolve(context);
		}
	}
}