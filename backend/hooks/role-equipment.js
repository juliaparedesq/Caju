// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => context => {
    let orgId = context.params.user?.organizationId;
    if(orgId != null){
        if(context.type == 'after' && context.path == "api/equipment" && orgId != context.result.organizationId){
            throw Error("Cannot request info of other user");
        }
    }
    return context;
  };
  
  