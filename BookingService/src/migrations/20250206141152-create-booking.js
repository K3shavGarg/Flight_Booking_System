'use strict';
/** @type {import('sequelize-cli').Migration} */

const {enums} = require('../utils/common');

const {PENDING,BOOKED,CANCELLED,INITIATED} = enums.BOOKING_status;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM,
        values:[PENDING,BOOKED,INITIATED,CANCELLED],
        defaultValue:INITIATED
      },
      noofSeats: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1 
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};