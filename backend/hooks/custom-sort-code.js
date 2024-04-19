const sequelize = require('sequelize');

const sortExp = (e, asc) =>
  `SUBSTRING(${e} FROM '([A-Za-z]+)') ${asc}, SUBSTRING(${e} FROM '([0-9]+)')::INT ${asc}`;

module.exports = (codeColumn = "code") => context => {
  if(context.params?.query?.$sort?.[codeColumn] != null){
    let sExp = sortExp(codeColumn, context.params.query.$sort[codeColumn] == 1 ? "ASC" : "DESC");
    context.params.sequelize = {
      order: sequelize.literal(sExp)
    };
    delete context.params.query.$sort;
  }
  return context;
};
