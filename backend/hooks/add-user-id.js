// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

/**
 * Add the user id to the data or query context
 * @param addOnQuery If true it add the user id to the query, otherwise it only adds to data
 * @param keyName Name of the field to put the user id
 */
module.exports = (addOnQuery = false, keyName = "userId") => (context) => {
  if(context.method == "create" || context.method == "update" || context.method == "patch"){
    context.data[keyName] = context.params.user?.id;
  }
  else if(addOnQuery){
    if(!context.params.query){
      context.params.query = {
        [keyName]: context.params.user?.id
      };
    }
    else {
      context.params.query[keyName] = context.params.user?.id;
    }
  }
  return context;
};
