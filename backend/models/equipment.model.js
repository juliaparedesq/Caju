// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const equipment = sequelizeClient.define('equipment', {
    series_number: {
      type: DataTypes.STRING
    },
    brand: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    ubication: {
      type: DataTypes.STRING
    },
    inventory_number: {
      type: DataTypes.STRING
    },
    critic: {
      type: DataTypes.STRING
    },
    clase: {
      type: DataTypes.STRING,
      defaultValue: "industrialSupport",
      validate: {
        isIn: [["industrialSupport", "verticalTransport", "energy", "liquidHandling", "communications", , 'diagnosticSupport', 'endoscopicSupport', 'industrySupport', 'surgicalSupport', 'therapeuticSupport', 'sterilization', 'imaging', 'laboratory/Pharmacy', 'physMedRehabilitation', 'monitoring', 'odontology', 'other', 'furniture']]
      }
      
    },
    subclase: {
      type: DataTypes.STRING,
      defaultValue: "weighing",
      validate: {
        isIn: [['weighing', 'refrigeration', 'cooking', 'chop', 'peel', 'shake', 'extraction', 'distribution', 'washed', 'decontamination', 'centrifugation', 'drying', 'ironing', 'sewing', 'compression', 'peopleTransport', 'freightTransport', 'electrical', 'caloric', 'sewageElevation', 'drinkingWaterLift', 'FluidLiftAndHotWater', 'UHFRadioCommunication', 'VHFRadioCommunication', 'HFRadioCommunication', 'RadioCommunicationViaMicrowave', 'safetyAndEscapeRoutes', 'highPrice', 'mediumCost', 'lowCost', 'instrumental', 'clinical']]
      }
    },
    cost_of_equipment: {
      type: DataTypes.INTEGER
    },
    model: {
      type: DataTypes.STRING
    },
    start_up_date: {
        type: DataTypes.DATE
    },
    active: {
      type: DataTypes.STRING,
      defaultValue: "operational",
      validate: {
       isIn: [["operational", "nonOperational", "deactivated"]]
      }
    },
    year_of_acquisition: {
      type: DataTypes.INTEGER
    },
    useful_life: {
      type: DataTypes.INTEGER
    },
    vur: {
      type: DataTypes.INTEGER
    },
    possession: {
      type: DataTypes.STRING,
      defaultValue: "own",
      validate: {
       isIn: [["own", "lease", "commodatum"]]
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "good",
      validate: {
        isIn: [["good", "bad", "regular"]]
      }
    },
    supplier: {
      type: DataTypes.STRING
    },
    periodicity_preventive_maintenance: {
      type: DataTypes.INTEGER
    },
    last_maintenance: {
      type: DataTypes.DATE
    },
    cost_of_maintenances: {
      type: DataTypes.INTEGER
    },
    deactivatedReason: {
      type: DataTypes.STRING
    },
    maintenance_indicator: {
      type: DataTypes.INTEGER
    },
    mi_function: {
      type: DataTypes.INTEGER
    },
    mi_aplication: {
      type: DataTypes.INTEGER
    },
    mi_maintenance: {
      type: DataTypes.INTEGER
    },
    mi_factor1: {
      type: DataTypes.INTEGER
    },
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  equipment.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    equipment.hasMany(models.maintenance);
    equipment.belongsTo(models.organization);
    equipment.belongsTo(models.equipmentType);
  };

  return equipment;
};
