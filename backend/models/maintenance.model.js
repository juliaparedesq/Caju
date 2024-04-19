// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const maintenance = sequelizeClient.define('maintenance', {
    date_of_maintenance: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    intention: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["preventive", "corrective", "agreement"]]
      }
    },
    comment: {
      type: DataTypes.STRING
    },
    labor_cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    extra_cost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_of_request: {
      type: DataTypes.DATE
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
  maintenance.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    maintenance.belongsTo(models.equipment);
    maintenance.belongsTo(models.provider, { through: 'Provider_Maintenance' });
    maintenance.belongsTo(models.users, { through: 'User_Maintenance' });
    maintenance.belongsTo(models.agreement);
  };

  return maintenance;
};
