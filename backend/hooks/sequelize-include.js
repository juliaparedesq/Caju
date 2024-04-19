// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

/**
 * Hook to include sequelize association
 * @param service - Path to the service to be merged
 * @param alias - Alias used in the association (Optional)
 * @param nested - Array of { service, alias } to be included in the nested merge.
 * It only support 1 level of nesting
 */
module.exports = (service, alias, nested) => context => {
  if (context.params.sequelize == null || context.params.sequelize.include == null) {
    context.params.sequelize = {
      include: []
    };
  }
  if(nested == null) {
    context.params.sequelize.include.push({
      model: context.app.service(service).Model,
      as: alias
    });
  }
  else {
    context.params.sequelize.include.push({
      model: context.app.service(service).Model,
      as: alias,
      include: nested.map(e => ({
        model: context.app.service(e.service).Model,
        as: e.alias,
      }))
    });
  }
  return context;
};
