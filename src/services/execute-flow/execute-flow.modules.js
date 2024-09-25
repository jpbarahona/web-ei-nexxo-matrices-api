const hydrate = require('feathers-sequelize/hooks/hydrate');
const axios = require('axios');

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
			
			data.procesos.forEach(proceso => {
				app.service('logs-procesos').create({
					estado: "Pendiente",
					executeFlowId: id,
					mensaje: "Proceso iniciado",
					proceso: proceso == 'oc' ? 'Orden de compra' : proceso.charAt(0).toUpperCase() + proceso.slice(1), // capitalize first letter
					rutaArchivo: ''
				});

				// // ejecutar functions
				// axios.post(`http://localhost:7071/api/${proceso}`, {
				// 	executeFlowId: id,
				// 	periodo: data.periodo,
				// 	ceco: data.ceco,
				// 	nuevaRevision: data.nuevaRevision
				// })
			});

			if(!data.procesos.includes('prebuk') && !data.procesos.includes('buk')){
				axios.post('https://prod-06.eastus.logic.azure.com:443/workflows/e47ae2c4ac524232af167cbea7e53d1b/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=RSsY7D8OCLC9cSQCAae0IVpeoQNkyhzFG8M1Msx95NQ', data);
			}else if(data.procesos.includes('buk')){
				axios.post(`ei-nexxo-matrices-estados-cuentas-microflujos.azurewebsites.net/api/prebuk`, {
					executeFlowId: id,
					periodo: data.periodo,
					ceco: data.ceco,
					nuevaRevision: data.nuevaRevision,
					buk: true
				})
			} else {
				axios.post(`ei-nexxo-matrices-estados-cuentas-microflujos.azurewebsites.net/api/prebuk`, {
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