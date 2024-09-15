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
	}
}