// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

/**
 * Retrict the call to certain roles. Important: Internal calls skip this check.
 * @param roles List of roles to be admitted
 */
module.exports = (roles) => (context) => {
  let userRole = context.params.user?.role;
  if(context.params.provider != null &&
    (userRole == null || !roles.includes(userRole)) &&
    (context.path != "users" || context.id != context.params.user?.id)){
    throw new Error("Authorization Error");
  }
};


