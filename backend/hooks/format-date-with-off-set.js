// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = ((column) => {
  return async context => {
    if (column) {
      if (context.result.data) {
        context.result.data = context.result.data.map((elem) => {
          const offset = new Date(elem[column]).getTimezoneOffset();
          let myDate = new Date(new Date(elem[column]).getTime() - (offset*60*1000));
          elem[column] = myDate.toLocaleString("es-CL").split(' ')[0];
          return elem;
        });
      }
      else {
        if (context.result[column]) {
          const offset = new Date(context.result[column]).getTimezoneOffset();
          let myDate = new Date(new Date(context.result[column]).getTime() - (offset*60*1000));
          context.result[column] =  myDate.toLocaleString("es-CL").split(' ')[0];
        }
      }
    }
    return context;
  };
});
