// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const sequelize = require('sequelize');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if(context.params.query.$filterByCostMaintenances != null){
      if(context.params.query.$filterByCostMaintenances == 'yes'){
        context.params.query.cost_of_equipment = {
          $lt: sequelize.col('cost_of_maintenances')
        }
      }
      else if(context.params.query.$filterByCostMaintenances == 'no'){
        context.params.query.cost_of_equipment = {
          $gte: sequelize.col('cost_of_maintenances')
        }
      }
      delete context.params.query.$filterByCostMaintenances
    }
    return context;
  };
};
