// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const agreement = sequelizeClient.define('agreement', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    intention: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["preventive", "corrective"]]
        }
    }, 
    start_date: {
        type: DataTypes.DATE
    },
    end_date: {
        type: DataTypes.DATE
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    equipments_list: {
        type: DataTypes.JSON,
        allowNull: false,
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
  agreement.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    agreement.belongsTo(models.provider);
    agreement.hasMany(models.maintenance);
    agreement.belongsTo(models.organization);
  };

  return agreement;
};
