'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.City,{
        foreignKey: 'cityId',
        onDelete:'CASCADE',
        as:'city'
      });
      this.hasMany(models.Flight,{
        foreignKey:'arrivalAirportId',
        sourceKey:'code',
        onDelete:'CASCADE'
      });
      this.hasMany(models.Flight,{
        foreignKey:'departureAirportId',
        sourceKey:'code',
        onDelete:'CASCADE'
      });
    }
  }
  Airports.init({
    name:{ 
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    code: {
      type:DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    address: {
      type: DataTypes.STRING,
      unique:true,
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Airports',
  });
  return Airports;
};