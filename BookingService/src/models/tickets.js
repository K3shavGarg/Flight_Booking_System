'use strict';
const {
  Model
} = require('sequelize');
const { SEAT_TYPE, TICKET_STATUS } = require('../utils/common/enum');
const {PREMIUM_ECONOMY, ECONOMY, BUSINESS, FIRST_CLASS} = SEAT_TYPE;
const {ISSUED, CHECKED_IN, CANCELLED} = TICKET_STATUS
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tickets.init({
     ticketId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seatNumber: {
      type: DataTypes.STRING
    },
    class: {
      type: DataTypes.ENUM(PREMIUM_ECONOMY, ECONOMY, BUSINESS, FIRST_CLASS),
      defaultValue: ECONOMY,
    },
    status: {
      type: DataTypes.ENUM(ISSUED, CANCELLED, CHECKED_IN),
      defaultValue: "ISSUED",
    },
    issueDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Tickets',
  });
  return Tickets;
};