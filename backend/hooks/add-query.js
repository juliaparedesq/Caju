// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// Add the passed object to the query
module.exports = (queryLike = {}) => context => {
  if(context.method == "find") {
    if (!context.params.query) {
      context.params.query = queryLike;
    }
    else {
      Object.assign(context.params.query, queryLike);
    }
  }
};
