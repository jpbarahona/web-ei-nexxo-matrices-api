const hydrate = require('feathers-sequelize/hooks/hydrate');
const axios = require('axios');
const { FUNCTIONAPI } = process.env;

module.exports = {
	// get employee associated to the user request
	include: (options = {}) => 
	{
		return async function (context) {

			const { app } = context;

			const sequelize = app.get('sequelizeClient');

			const { logs_procesos } = sequelize.models;
				
			var association = {
				order: [['id', 'desc']],
				model: logs_procesos
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
			
			async function ejecutarProcesosSecuencialmente(data, id, app) {
				for (const proceso of data.procesos) {
				  // Crear un log para el proceso
				  await app.service('logs-procesos').create({
					estado: "Pendiente",
					executeFlowId: id,
					mensaje: "Proceso iniciado",
					proceso: proceso === 'oc' ? 'Orden de compra' : proceso.charAt(0).toUpperCase() + proceso.slice(1), // Capitaliza la primera letra
					rutaArchivo: ''
				  });
				}

				// Ejecutar la función asincrónicamente con axios.post
				axios.post(`${FUNCTIONAPI}/api/${data.procesos[0]}`, {
				  executeFlowId: id,
				  periodo: data.periodo,
				  ceco: data.ceco,
				  nuevaRevision: data.nuevaRevision
				})
				.then( r => {
					// Ejecutar la función asincrónicamente con axios.post
					axios.post(`${FUNCTIONAPI}/api/${data.procesos[1]}`, {
						executeFlowId: id,
						periodo: data.periodo,
						ceco: data.ceco,
						nuevaRevision: false
				  	})
					.then( r => {
						// Ejecutar la función asincrónicamente con axios.post
						axios.post(`${FUNCTIONAPI}/api/${data.procesos[2]}`, {
							executeFlowId: id,
							periodo: data.periodo,
							ceco: data.ceco,
							nuevaRevision: false
						})
						.then( r => {
							// Ejecutar la función asincrónicamente con axios.post
							axios.post(`${FUNCTIONAPI}/api/${data.procesos[3]}`, {
								executeFlowId: id,
								periodo: data.periodo,
								ceco: data.ceco,
								nuevaRevision: false
							});
						})
					})
				})
			}
			
			ejecutarProcesosSecuencialmente(data, id, app);

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