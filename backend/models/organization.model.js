// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const organization = sequelizeClient.define('organization', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adress: {
      type: DataTypes.STRING
    },
    neighborhood: {
      type: DataTypes.STRING
    },
    mail: {
        type: DataTypes.STRING
    },
    contact_person: {
        type: DataTypes.STRING    
    },
    code: {
        type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  organization.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    organization.hasMany(models.users);
    organization.hasMany(models.equipment);
    organization.belongsTo(models.healthService);
  };

  return organization;
};
