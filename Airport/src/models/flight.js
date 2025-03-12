'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Airplane,{
        foreignKey:'airplaneId',
        as:'airplaneDetails'   // Defining an alias so that when query 
      });
      this.belongsTo(models.Airports,{
        foreignKey:'departureAirportId',
        targetKey: 'code',
        as:'departureAirport'
      });
      this.belongsTo(models.Airports,{
        foreignKey:'arrivalAirportId',
        targetKey:'code',
        as:'arrivalAirport'
      });
    }
  }
  Flight.init({
    flightNumber: {
      type:DataTypes.STRING,
      allowNull:false
    },
    airplaneId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    departureAirportId:{
      type:DataTypes.STRING,
      allowNull:false
    },
    arrivalAirportId:{
      type:DataTypes.STRING,
      allowNull:false
    },
    arrivalTime:{
      type: DataTypes.DATE,
      allowNull:false
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull:false
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    totalSeats: {  // Remaining Seats 
      type:DataTypes.INTEGER,
      allowNull:false
    },
    boardingGate:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};