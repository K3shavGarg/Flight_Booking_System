'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Airplane extends Model {
    static associate(models) {
      // define associations here
      this.hasMany(models.Flight,{
        foreignKey:'airplaneId',
        onDelete:'CASCADE'
      });
      this.hasMany(models.Seat,{
        foreignKey:'airplaneId',
        onDelete:'CASCADE'
      });
    }
  }

  Airplane.init({
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        // Custom Validator 
        isValidModelName(value) {
          if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
            throw new Error('Model name must be alphanumeric and can include spaces.');
          }
        }
      }
    }, 
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate:{
        max: 500,
        isInt: true,
      }
    },
  }, {
    sequelize,
    modelName: 'Airplane',
  });

  return Airplane;
};
