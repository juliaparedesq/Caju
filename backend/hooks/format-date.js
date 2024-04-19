// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = ((column) => {
  return async context => {
    if (column) {
      if (context.result.data) {
        context.result.data = context.result.data.map((elem) => {
          elem[column] = elem[column] ? new Date(elem[column]).toLocaleString("es-CL") : null;
          return elem;
        });
      }
      else {
        context.result[column] = context.result[column] ? new Date(context.result[column]).toLocaleString("es-CL") : null;
      }
    }
    return context;
  };
});
