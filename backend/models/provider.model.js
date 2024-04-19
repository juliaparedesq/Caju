// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const provider = sequelizeClient.define('provider', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pm_agreement: {
      type: DataTypes.BOOLEAN
    }, 
    cm_agreement: {
      type: DataTypes.BOOLEAN
    },
    bidding: {
      type: DataTypes.STRING
    },
    purchase_order: {
      type: DataTypes.STRING
    },
    contract_resolution: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  provider.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    provider.hasMany(models.maintenance);
    provider.hasMany(models.agreement);
  };

  return provider;
};
