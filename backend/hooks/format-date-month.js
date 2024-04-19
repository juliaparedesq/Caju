// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = ((column) => {
  return async context => {
    let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Deciembre'];
    if (column) {
      context.result.data = context.result.data.map((elem) => {
        let date = new Date(elem[column]);
        elem[column] = elem[column]? `${months[date.getMonth()]} ${date.getFullYear()}`: null;
        return elem;
      });
    }
    return context;
  };
});
