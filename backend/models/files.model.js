// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const files = sequelizeClient.define('files', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    extension: {
      type: DataTypes.STRING,
      // validate: {
      //   isIn: [
      //     ["jpeg", "jpg", "png", "pdf"]
      //   ]
      // }
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    maintenanceId:{
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  // eslint-disable-next-line no-unused-vars
  files.associate = function (models) {
    files.belongsTo(models.equipment);
    files.belongsTo(models.maintenance);
  };

  return files;
};
