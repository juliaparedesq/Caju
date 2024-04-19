// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const healthService = sequelizeClient.define('healthService', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  healthService.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    healthService.hasMany(models.organization);
  };

  return healthService;
};
