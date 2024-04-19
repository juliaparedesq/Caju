// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = ((column) => {
  return async context => {
    if (column) {
      context.result.data = context.result.data.map((elem) => {
        elem[column] = elem[column]? "Si" : "No";
        return elem;
      });
    }
    return context;
  };
});
