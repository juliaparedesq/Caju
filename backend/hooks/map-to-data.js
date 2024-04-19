// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = (fun) => context => {
  if(context.result.total > 0 && context.result.data){
    context.result.data = context.result.data.map(fun);
  }
  return context;
};
